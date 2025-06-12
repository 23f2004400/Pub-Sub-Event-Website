#!/usr/bin/env python3

import asyncio
import uuid
from datetime import datetime
import sys
import signal
from redis_client import RedisClient
from models import EventInvitation, EventSummary
from config import Config

class EventHost:
    def __init__(self, host_name: str, host_id: str = None):
        self.host_name = host_name
        self.host_id = host_id or str(uuid.uuid4())
        self.redis_client = RedisClient()
        self.running = True
        
        # Create consumer group for receiving summaries
        self.redis_client.create_consumer_group(
            Config.SUMMARY_STREAM, 
            Config.HOST_GROUP
        )
        
        print(f"🎯 Event Host '{self.host_name}' (ID: {self.host_id}) initialized")
        print(f"🔗 Connected to Redis Pub/Sub system")
    
    def create_invitation(self, event_name: str, event_date: str, event_time: str, 
                         location: str, description: str) -> EventInvitation:
        """Create a new event invitation"""
        invitation = EventInvitation(
            id=str(uuid.uuid4()),
            event_name=event_name,
            event_date=event_date,
            event_time=event_time,
            location=location,
            description=description,
            host_name=self.host_name,
            host_id=self.host_id,
            timestamp=datetime.now()
        )
        return invitation
    
    def publish_invitation(self, invitation: EventInvitation):
        """Publish an invitation to the coordinator via Redis Streams"""
        print(f"\n📤 PUBLISHING INVITATION")
        print(f"🎉 Event: {invitation.event_name}")
        print(f"📅 Date: {invitation.event_date} at {invitation.event_time}")
        print(f"📍 Location: {invitation.location}")
        print(f"📝 Description: {invitation.description}")
        
        message_id = self.redis_client.publish_message(
            Config.INVITATION_STREAM,
            invitation.to_redis_dict()
        )
        
        print(f"✅ Invitation published to Redis stream with ID: {message_id}")
        return message_id
    
    async def listen_for_summaries(self):
        """Listen for event summaries from the coordinator via Redis Streams"""
        print(f"👂 Listening for event summaries...")
        
        while self.running:
            try:
                messages = self.redis_client.consume_messages(
                    Config.SUMMARY_STREAM,
                    Config.HOST_GROUP,
                    f"host_{self.host_id}",
                    count=1,
                    block=1000
                )
                
                for stream, stream_messages in messages:
                    for message_id, fields in stream_messages:
                        # Check if this summary is for this host
                        if fields.get('host_id') == self.host_id:
                            summary = EventSummary.from_redis_dict(fields)
                            self.process_summary(summary)
                            
                            # Acknowledge the message
                            self.redis_client.acknowledge_message(
                                Config.SUMMARY_STREAM,
                                Config.HOST_GROUP,
                                message_id
                            )
                        
            except Exception as e:
                if self.running:
                    print(f"❌ Error listening for summaries: {e}")
                await asyncio.sleep(1)
    
    def process_summary(self, summary: EventSummary):
        """Process and display the event summary"""
        print(f"\n🎉 RECEIVED EVENT SUMMARY VIA REDIS PUB/SUB")
        print(f"=" * 50)
        print(f"📊 Event Summary for Invitation ID: {summary.invitation_id}")
        print(f"👥 Total Invited: {summary.total_invited}")
        print(f"📝 Total Responses: {summary.total_responses}")
        print(f"✅ Attending: {summary.yes_count}")
        print(f"❓ Maybe: {summary.maybe_count}")
        print(f"❌ Not Attending: {summary.no_count}")
        print(f"📈 Response Rate: {(summary.total_responses/summary.total_invited)*100:.1f}%")
        print(f"🎯 Attendance Rate: {(summary.yes_count/summary.total_invited)*100:.1f}%")
        
        print(f"\n📋 DETAILED RESPONSES:")
        print("-" * 30)
        
        for response in summary.responses:
            status_emoji = {"yes": "✅", "no": "❌", "maybe": "❓"}.get(response.response, "❓")
            print(f"{status_emoji} {response.guest_name}: {response.response.upper()}")
            if response.message:
                print(f"   💬 \"{response.message}\"")
        
        print(f"\n🎊 Summary complete! Event planning finished via Pub/Sub.")
        print("=" * 50)
    
    def stop(self):
        """Stop the host"""
        self.running = False
        print(f"\n🛑 Event Host '{self.host_name}' stopping...")

def signal_handler(signum, frame):
    print("\n🛑 Received interrupt signal...")
    sys.exit(0)

async def main():
    signal.signal(signal.SIGINT, signal_handler)
    
    # Create host instance
    host = EventHost("Sarah Johnson")
    
    # Start listening for summaries in background
    summary_task = asyncio.create_task(host.listen_for_summaries())
    
    try:
        print("🎯 Event Host started! Creating sample invitation...")
        
        # Create and publish a sample invitation
        invitation = host.create_invitation(
            event_name="Team Building Workshop",
            event_date="2025-02-15",
            event_time="14:00",
            location="Conference Room A",
            description="Join us for an engaging team building session with fun activities and networking opportunities!"
        )
        
        host.publish_invitation(invitation)
        
        print("\n⏳ Waiting for responses from guests via Redis Pub/Sub...")
        print("💡 The coordinator will collect all responses and send back a summary.")
        print("🔄 This may take a few moments as guests respond at different times...")
        
        # Keep the host running to receive summaries
        await summary_task
        
    except KeyboardInterrupt:
        print("\n🛑 Host interrupted by user")
    finally:
        host.stop()
        summary_task.cancel()

if __name__ == "__main__":
    print("🎯 STARTING EVENT HOST - PUB/SUB COMPONENT")
    print("=" * 50)
    print("📡 This component publishes invitations and receives summaries")
    print("🔗 Uses Redis Streams for Pub/Sub messaging")
    print("=" * 50)
    asyncio.run(main())