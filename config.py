import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    REDIS_HOST = os.getenv('REDIS_HOST', 'localhost')
    REDIS_PORT = int(os.getenv('REDIS_PORT', 6379))
    REDIS_DB = int(os.getenv('REDIS_DB', 0))
    
    # Stream names for Pub/Sub
    INVITATION_STREAM = 'event_invitations'
    RESPONSE_STREAM = 'guest_responses'
    SUMMARY_STREAM = 'event_summaries'
    
    # Consumer groups
    COORDINATOR_GROUP = 'coordinators'
    GUEST_GROUP = 'guests'
    HOST_GROUP = 'hosts'