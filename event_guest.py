#!/usr/bin/env python3

import asyncio
import uuid
import random
from datetime import datetime
import sys
import signal
from redis_client import RedisClient
from models import EventInvitation, GuestResponse
from config import Config

class EventGuest:
    def __init__(self, guest_name: str, guest_id: str = None, preferences: dict = None):
        self.guest_name = guest_name
        self.guest_id = guest_id or str(uuid.uuid4())
        self.preferences = preferences or self._default_preferences()
        self.redis_client = RedisClient()
        self.running = True
        
        # Create consumer group for receiving invitations
        self.redis_client.create_consumer_group(
            Config.INVITATION_STREAM, 
            Config.GUEST_GROUP
        )
        
        print(f"👤 Guest '{self.guest_name}' (ID: {self.guest_id}) initialized")
        print(f"🎯 Preferences: {self.preferences}")
        print(f"🔗 Connected to Redis Pub/Sub system")
    
    def _default_preferences(self):
        """Default guest preferences"""
        return {
            'response_delay': random.uniform(1, 5),  # seconds
            'likely_response': random.choice(['yes', 'no', 'maybe']),
            'response_probability': {
                'yes': 0.4,
                'maybe': 0.3,
                'no': 0.3
            }
        }
    
    async def listen_for_invitations(self):
        """Listen for invitations from the coordinator via Redis Streams"""
        print(f"👂 {self.guest_name} is listening for invitations...")
        
        while self.running:
            try:
                messages = self.redis_client.consume_messages(
                    Config.INVITATION_STREAM,
                    Config.GUEST_GROUP,
                    f"guest_{self.guest_id}",
                    count=1,
                    block=1000
                )
                
                for stream, stream_messages in messages:
                    for message_id, fields in stream_messages:
                        # Check if this invitation is for this guest or is a general invitation
                        target_guest_id = fields.get('target_guest_id')
                        if target_guest_id and target_guest_id != self.guest_id:
                            # This invitation is for a different guest, skip it
                            continue
                        
                        invitation = EventInvitation.from_redis_dict(fields)
                        await self.process_invitation(invitation)
                        
                        # Acknowledge the message
                        self.redis_client.acknowledge_message(
                            Config.INVITATION_STREAM,
                            Config.GUEST_GROUP,
                            message_id
                        )
                        
            except Exception as e:
                if self.running:
                    print(f"❌ Error listening for invitations: {e}")
                await asyncio.sleep(1)
    
    async def process_invitation(self, invitation: EventInvitation):
        """Process an invitation and generate a response"""
        print(f"\n📨 {self.guest_name} RECEIVED INVITATION VIA REDIS")
        print(f"🎉 Event: {invitation.event_name}")
        print(f"👤 Host: {invitation.host_name}")
        print(f"📅 Date: {invitation.event_date} at {invitation.event_time}")
        print(f"📍 Location: {invitation.location}")
        print(f"📝 Description: {invitation.description}")
        
        # Simulate thinking time
        thinking_time = self.preferences['response_delay']
        print(f"🤔 {self.guest_name} is thinking... (will respond in {thinking_time:.1f}s)")
        await asyncio.sleep(thinking_time)
        
        # Generate response
        response = self._generate_response(invitation)
        
        # Send response
        await self.send_response(response)
    
    def _generate_response(self, invitation: EventInvitation) -> GuestResponse:
        """Generate a response based on guest preferences"""
        # Use preferences to influence response
        likely_response = self.preferences.get('likely_response', 'maybe')
        probabilities = self.preferences.get('response_probability', {
            'yes': 0.4, 'maybe': 0.3, 'no': 0.3
        })
        
        # Add some randomness but bias toward likely response
        if random.random() < 0.7:  # 70% chance to follow preference
            response_choice = likely_response
        else:  # 30% chance for random response
            choices = list(probabilities.keys())
            weights = list(probabilities.values())
            response_choice = random.choices(choices, weights=weights)[0]
        
        # Generate appropriate message
        messages = {
            'yes': [
                "Looking forward to it!",
                "Count me in!",
                "Sounds great, I'll be there!",
                "Yes, definitely attending!",
                "Can't wait to join!",
                "I'll definitely be there!"
            ],
            'no': [
                "Sorry, I have a conflict that day.",
                "Unfortunately, I can't make it.",
                "I have another commitment.",
                "Sorry, won't be able to attend.",
                "Previous engagement, sorry!",
                "Wish I could, but I'm not available."
            ],
            'maybe': [
                "I'll try my best to make it.",
                "Tentatively yes, but might change.",
                "Let me check my schedule and confirm.",
                "Possibly, depends on other meetings.",
                "I'll confirm closer to the date.",
                "Hoping to attend, but not 100% sure yet."
            ]
        }
        
        response_message = random.choice(messages[response_choice])
        
        return GuestResponse(
            id=str(uuid.uuid4()),
            invitation_id=invitation.id,
            guest_name=self.guest_name,
            guest_id=self.guest_id,
            response=response_choice,
            message=response_message,
            timestamp=datetime.now()
        )
    
    async def send_response(self, response: GuestResponse):
        """Send response back to coordinator via Redis Streams"""
        status_emoji = {"yes": "✅", "no": "❌", "maybe": "❓"}.get(response.response, "❓")
        
        print(f"\n📤 {self.guest_name} SENDING RESPONSE")
        print(f"{status_emoji} Response: {response.response.upper()}")
        print(f"💬 Message: \"{response.message}\"")
        
        self.redis_client.publish_message(
            Config.RESPONSE_STREAM,
            response.to_redis_dict()
        )
        
        print(f"✅ Response sent to coordinator via Redis Streams")
    
    def stop(self):
        """Stop the guest"""
        self.running = False
        print(f"\n🛑 Guest '{self.guest_name}' stopping...")

def signal_handler(signum, frame):
    print("\n🛑 Received interrupt signal...")
    sys.exit(0)

async def main():
    signal.signal(signal.SIGINT, signal_handler)
    
    # Create guest instances with different preferences
    guests = [
        EventGuest("Alice Chen", "guest_1", {
            'response_delay': 2.0,
            'likely_response': 'yes',
            'response_probability': {'yes': 0.7, 'maybe': 0.2, 'no': 0.1}
        }),
        EventGuest("Bob Rodriguez", "guest_2", {
            'response_delay': 3.0,
            'likely_response': 'maybe',
            'response_probability': {'yes': 0.3, 'maybe': 0.5, 'no': 0.2}
        }),
        EventGuest("Carol Williams", "guest_3", {
            'response_delay': 1.5,
            'likely_response': 'yes',
            'response_probability': {'yes': 0.8, 'maybe': 0.1, 'no': 0.1}
        }),
        EventGuest("David Kim", "guest_4", {
            'response_delay': 4.0,
            'likely_response': 'no',
            'response_probability': {'yes': 0.2, 'maybe': 0.2, 'no': 0.6}
        }),
        EventGuest("Emma Thompson", "guest_5", {
            'response_delay': 2.5,
            'likely_response': 'maybe',
            'response_probability': {'yes': 0.4, 'maybe': 0.4, 'no': 0.2}
        })
    ]
    
    # Start all guests listening concurrently
    tasks = []
    for guest in guests:
        task = asyncio.create_task(guest.listen_for_invitations())
        tasks.append(task)
    
    try:
        print("👥 All guests are now listening for invitations...")
        print("💡 Each guest has different response preferences and delays")
        print("🔄 Guests will automatically respond when they receive invitations")
        print("📡 All communication via Redis Pub/Sub streams")
        
        # Run all guest listeners concurrently
        await asyncio.gather(*tasks)
        
    except KeyboardInterrupt:
        print("\n🛑 Guests interrupted by user")
    finally:
        for guest in guests:
            guest.stop()
        for task in tasks:
            task.cancel()

if __name__ == "__main__":
    print("👥 STARTING EVENT GUESTS - PUB/SUB COMPONENT")
    print("=" * 50)
    print("📡 This component receives invitations and sends responses")
    print("🔗 Uses Redis Streams for Pub/Sub messaging")
    print("=" * 50)
    asyncio.run(main())