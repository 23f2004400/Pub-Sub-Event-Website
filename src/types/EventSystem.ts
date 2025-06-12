export interface EventInvitation {
  id: string;
  eventName: string;
  eventDate: string;
  eventTime: string;
  location: string;
  description: string;
  hostName: string;
  timestamp: number;
}

export interface GuestResponse {
  id: string;
  invitationId: string;
  guestName: string;
  response: 'yes' | 'no' | 'maybe';
  message?: string;
  timestamp: number;
}

export interface EventSummary {
  id: string;
  invitationId: string;
  totalInvited: number;
  totalResponses: number;
  yesCount: number;
  noCount: number;
  maybeCount: number;
  responses: GuestResponse[];
  timestamp: number;
}

export interface Message {
  id: string;
  type: 'invitation' | 'response' | 'summary';
  from: string;
  to: string;
  content: any;
  timestamp: number;
  status: 'sending' | 'delivered' | 'processed';
}

export interface Guest {
  id: string;
  name: string;
  email: string;
  preferences: {
    responseDelay: number;
    likelyResponse: 'yes' | 'no' | 'maybe' | 'random';
  };
}