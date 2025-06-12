import redis
from config import Config
from typing import Dict

class RedisClient:
    def __init__(self):
        self.redis = redis.Redis(
            host=Config.REDIS_HOST,
            port=Config.REDIS_PORT,
            db=Config.REDIS_DB,
            decode_responses=True
        )
        self._ensure_streams_exist()
    
    def _ensure_streams_exist(self):
        """Create streams if they don't exist"""
        streams = [
            Config.INVITATION_STREAM,
            Config.RESPONSE_STREAM,
            Config.SUMMARY_STREAM
        ]
        
        for stream in streams:
            try:
                # Try to create the stream with a dummy message
                self.redis.xadd(stream, {'init': 'stream_created'})
                # Remove the dummy message
                messages = self.redis.xrange(stream, count=1)
                if messages:
                    self.redis.xdel(stream, messages[0][0])
            except redis.ResponseError:
                pass  # Stream might already exist
    
    def create_consumer_group(self, stream: str, group: str, consumer_id: str = '0'):
        """Create a consumer group for a stream"""
        try:
            self.redis.xgroup_create(stream, group, consumer_id, mkstream=True)
            print(f"✅ Created consumer group '{group}' for stream '{stream}'")
        except redis.ResponseError as e:
            if "BUSYGROUP" not in str(e):
                print(f"❌ Error creating consumer group: {e}")
    
    def publish_message(self, stream: str, data: Dict) -> str:
        """Publish a message to a Redis stream"""
        message_id = self.redis.xadd(stream, data)
        print(f"📤 Published message {message_id} to stream '{stream}'")
        return message_id
    
    def consume_messages(self, stream: str, group: str, consumer: str, count: int = 1, block: int = 1000):
        """Consume messages from a Redis stream using consumer groups"""
        try:
            messages = self.redis.xreadgroup(
                group, consumer, {stream: '>'}, count=count, block=block
            )
            return messages
        except redis.ResponseError as e:
            print(f"❌ Error consuming messages: {e}")
            return []
    
    def acknowledge_message(self, stream: str, group: str, message_id: str):
        """Acknowledge that a message has been processed"""
        self.redis.xack(stream, group, message_id)
        print(f"✅ Acknowledged message {message_id} in stream '{stream}'")
    
    def cleanup_streams(self):
        """Clean up all streams (for testing/demo purposes)"""
        streams = [
            Config.INVITATION_STREAM,
            Config.RESPONSE_STREAM,
            Config.SUMMARY_STREAM
        ]
        
        for stream in streams:
            try:
                self.redis.delete(stream)
                print(f"🧹 Cleaned up stream '{stream}'")
            except redis.ResponseError:
                pass