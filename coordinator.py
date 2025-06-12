#!/usr/bin/env python3

import asyncio
import uuid
from datetime import datetime
import sys
import signal
from collections import defaultdict
from redis_client import RedisClient
from models import EventInvitation, GuestResponse, EventSummary
from config import Config

class Coordinator:
    def __init__(self):
        self.redis_client = RedisClient()
        self.running = True
        self.pending_invitations = {}  # invitation_id -> invitation
        self.guest_responses = defaultdict(list)  # invitation_id -> [responses]
        self.expected_guests = {}  # invitation_id -> expected_count
        
        # Create consumer groups for Redis Streams
        self.redis_client.create_consumer_group(
            Config.INVITATION_STREAM, 
            Config.COORDINATOR_GROUP
        )
        self.redis_client.create_consumer_group(
            Config.RESPONSE_STREAM, 
            Config.COORDINATOR_GROUP
        )
        
        print("🎛️  Coordinator service initialized and ready")
        print("🔗 Connected to Redis Pub/Sub system")
    
    async def listen_for_invitations(self):
        """Listen for new invitations from hosts via Redis Streams"""
        print("👂 Listening for invitations from hosts...")
        
        while self.running:
            try:
                messages = self.redis_client.consume_messages(
                    Config.INVITATION_STREAM,
                    Config.COORDINATOR_GROUP,
                    "coordinator_main",
                    count=1,
                    block=1000
                )
                
                for stream, stream_messages in messages:
                    for message_id, fields in stream_messages:
                        invitation = EventInvitation.from_redis_dict(fields)
                        await self.process_invitation(invitation)
                        
                        # Acknowledge the message
                        self.redis_client.acknowledge_message(
                            Config.INVITATION_STREAM,
                            Config.COORDINATOR_GROUP,
                            message_id
                        )
                        
            except Exception as e:
                if self.running:
                    print(f"❌ Error listening for invitations: {e}")
                await asyncio.sleep(1)
    
    async def process_invitation(self, invitation: EventInvitation):
        """Process a new invitation and forward to all registered guests"""
        print(f"\n📨 RECEIVED INVITATION FROM HOST VIA REDIS")
        print(f"🎉 Event: {invitation.event_name}")
        print(f"👤 Host: {invitation.host_name}")
        print(f"📅 Date: {invitation.event_date} at {invitation.event_time}")
        print(f"📍 Location: {invitation.location}")
        
        # Store the invitation
        self.pending_invitations[invitation.id] = invitation
        
        # Simulate registered guests (in a real system, this would come from a database)
        registered_guests = [
            {"id": "guest_1", "name": "Alice Chen", "email": "alice.chen@company.com"},
            {"id": "guest_2", "name": "Bob Rodriguez", "email": "bob.rodriguez@company.com"},
            {"id": "guest_3", "name": "Carol Williams", "email": "carol.williams@company.com"},
            {"id": "guest_4", "name": "David Kim", "email": "david.kim@company.com"},
            {"id": "guest_5", "name": "Emma Thompson", "email": "emma.thompson@company.com"},
        ]
        
        self.expected_guests[invitation.id] = len(registered_guests)
        
        print(f"📤 Forwarding invitation to {len(registered_guests)} registered guests...")
        
        # Forward invitation to all registered guests via Redis Streams
        for guest in registered_guests:
            guest_invitation_data = invitation.to_redis_dict()
            guest_invitation_data['target_guest_id'] = guest['id']
            guest_invitation_data['target_guest_name'] = guest['name']
            
            self.redis_client.publish_message(
                Config.INVITATION_STREAM,
                guest_invitation_data
            )
            
            print(f"   ✉️  Sent to {guest['name']} ({guest['email']}) via Redis")
        
        print(f"✅ Invitation forwarded to all guests via Redis Streams")
    
    async def listen_for_responses(self):
        """Listen for responses from guests via Redis Streams"""
        print("👂 Listening for responses from guests...")
        
        while self.running:
            try:
                messages = self.redis_client.consume_messages(
                    Config.RESPONSE_STREAM,
                    Config.COORDINATOR_GROUP,
                    "coordinator_responses",
                    count=1,
                    block=1000
                )
                
                for stream, stream_messages in messages:
                    for message_id, fields in stream_messages:
                        response = GuestResponse.from_redis_dict(fields)
                        await self.process_response(response)
                        
                        # Acknowledge the message
                        self.redis_client.acknowledge_message(
                            Config.RESPONSE_STREAM,
                            Config.COORDINATOR_GROUP,
                            message_id
                        )
                        
            except Exception as e:
                if self.running:
                    print(f"❌ Error listening for responses: {e}")
                await asyncio.sleep(1)
    
    async def process_response(self, response: GuestResponse):
        """Process a guest response received via Redis"""
        status_emoji = {"yes": "✅", "no": "❌", "maybe": "❓"}.get(response.response, "❓")
        
        print(f"\n📝 GUEST RESPONSE RECEIVED VIA REDIS")
        print(f"{status_emoji} {response.guest_name}: {response.response.upper()}")
        if response.message:
            print(f"💬 Message: \"{response.message}\"")
        
        # Store the response
        self.guest_responses[response.invitation_id].append(response)
        
        # Check if we have all responses for this invitation
        expected_count = self.expected_guests.get(response.invitation_id, 0)
        current_count = len(self.guest_responses[response.invitation_id])
        
        print(f"📊 Responses collected: {current_count}/{expected_count}")
        
        if current_count >= expected_count:
            await self.generate_summary(response.invitation_id)
    
    async def generate_summary(self, invitation_id: str):
        """Generate and send summary back to host via Redis Streams"""
        invitation = self.pending_invitations.get(invitation_id)
        responses = self.guest_responses.get(invitation_id, [])
        
        if not invitation:
            print(f"❌ No invitation found for ID: {invitation_id}")
            return
        
        print(f"\n📊 GENERATING SUMMARY")
        print(f"🎉 Event: {invitation.event_name}")
        
        # Count responses
        yes_count = sum(1 for r in responses if r.response == 'yes')
        no_count = sum(1 for r in responses if r.response == 'no')
        maybe_count = sum(1 for r in responses if r.response == 'maybe')
        
        # Create summary
        summary = EventSummary(
            id=str(uuid.uuid4()),
            invitation_id=invitation_id,
            host_id=invitation.host_id,
            total_invited=len(responses),
            total_responses=len(responses),
            yes_count=yes_count,
            no_count=no_count,
            maybe_count=maybe_count,
            responses=responses,
            timestamp=datetime.now()
        )
        
        print(f"✅ Attending: {yes_count}")
        print(f"❓ Maybe: {maybe_count}")
        print(f"❌ Not Attending: {no_count}")
        print(f"📈 Response Rate: 100%")
        print(f"🎯 Attendance Rate: {(yes_count/len(responses))*100:.1f}%")
        
        # Send summary back to host via Redis Streams
        self.redis_client.publish_message(
            Config.SUMMARY_STREAM,
            summary.to_redis_dict()
        )
        
        print(f"📤 Summary sent back to host: {invitation.host_name} via Redis")
        
        # Clean up
        del self.pending_invitations[invitation_id]
        del self.guest_responses[invitation_id]
        del self.expected_guests[invitation_id]
        
        print(f"🧹 Cleaned up data for invitation: {invitation_id}")
    
    def stop(self):
        """Stop the coordinator"""
        self.running = False
        print("\n🛑 Coordinator stopping...")

def signal_handler(signum, frame):
    print("\n🛑 Received interrupt signal...")
    sys.exit(0)

async def main():
    signal.signal(signal.SIGINT, signal_handler)
    
    coordinator = Coordinator()
    
    # Start both listeners concurrently
    invitation_task = asyncio.create_task(coordinator.listen_for_invitations())
    response_task = asyncio.create_task(coordinator.listen_for_responses())
    
    try:
        print("🎛️  Coordinator is running...")
        print("💡 Ready to receive invitations from hosts and responses from guests")
        print("🔄 Will automatically forward invitations and generate summaries")
        print("📡 All communication via Redis Pub/Sub streams")
        
        # Run both tasks concurrently
        await asyncio.gather(invitation_task, response_task)
        
    except KeyboardInterrupt:
        print("\n🛑 Coordinator interrupted by user")
    finally:
        coordinator.stop()
        invitation_task.cancel()
        response_task.cancel()

if __name__ == "__main__":
    print("🎛️  STARTING COORDINATOR - PUB/SUB COMPONENT")
    print("=" * 50)
    print("📡 This component routes messages between hosts and guests")
    print("🔗 Uses Redis Streams for Pub/Sub messaging")
    print("=" * 50)
    asyncio.run(main())