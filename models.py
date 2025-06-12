from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import json

class EventInvitation(BaseModel):
    id: str
    event_name: str
    event_date: str
    event_time: str
    location: str
    description: str
    host_name: str
    host_id: str
    timestamp: datetime
    
    def to_redis_dict(self):
        return {
            'id': self.id,
            'event_name': self.event_name,
            'event_date': self.event_date,
            'event_time': self.event_time,
            'location': self.location,
            'description': self.description,
            'host_name': self.host_name,
            'host_id': self.host_id,
            'timestamp': self.timestamp.isoformat()
        }
    
    @classmethod
    def from_redis_dict(cls, data):
        data['timestamp'] = datetime.fromisoformat(data['timestamp'])
        return cls(**data)

class GuestResponse(BaseModel):
    id: str
    invitation_id: str
    guest_name: str
    guest_id: str
    response: str  # 'yes', 'no', 'maybe'
    message: Optional[str] = None
    timestamp: datetime
    
    def to_redis_dict(self):
        return {
            'id': self.id,
            'invitation_id': self.invitation_id,
            'guest_name': self.guest_name,
            'guest_id': self.guest_id,
            'response': self.response,
            'message': self.message or '',
            'timestamp': self.timestamp.isoformat()
        }
    
    @classmethod
    def from_redis_dict(cls, data):
        data['timestamp'] = datetime.fromisoformat(data['timestamp'])
        if not data['message']:
            data['message'] = None
        return cls(**data)

class EventSummary(BaseModel):
    id: str
    invitation_id: str
    host_id: str
    total_invited: int
    total_responses: int
    yes_count: int
    no_count: int
    maybe_count: int
    responses: List[GuestResponse]
    timestamp: datetime
    
    def to_redis_dict(self):
        return {
            'id': self.id,
            'invitation_id': self.invitation_id,
            'host_id': self.host_id,
            'total_invited': self.total_invited,
            'total_responses': self.total_responses,
            'yes_count': self.yes_count,
            'no_count': self.no_count,
            'maybe_count': self.maybe_count,
            'responses': json.dumps([r.dict() for r in self.responses]),
            'timestamp': self.timestamp.isoformat()
        }
    
    @classmethod
    def from_redis_dict(cls, data):
        data['timestamp'] = datetime.fromisoformat(data['timestamp'])
        responses_data = json.loads(data['responses'])
        data['responses'] = [GuestResponse(**r) for r in responses_data]
        return cls(**data)