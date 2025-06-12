import { useState, useCallback, useRef } from 'react';
import { 
  EventInvitation, 
  GuestResponse, 
  EventSummary, 
  Message, 
  Guest 
} from '../types/EventSystem';

export const usePubSubSystem = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInvitation, setCurrentInvitation] = useState<EventInvitation | null>(null);
  const [guestResponses, setGuestResponses] = useState<GuestResponse[]>([]);
  const [eventSummary, setEventSummary] = useState<EventSummary | null>(null);
  const [systemStatus, setSystemStatus] = useState<{
    host: 'idle' | 'active' | 'processing';
    coordinator: 'idle' | 'active' | 'processing';
    guests: 'idle' | 'active' | 'processing';
  }>({
    host: 'idle',
    coordinator: 'idle',
    guests: 'idle'
  });

  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const guests: Guest[] = [
    {
      id: 'guest-1',
      name: 'Alice Chen',
      email: 'alice.chen@company.com',
      preferences: { responseDelay: 2000, likelyResponse: 'yes' }
    },
    {
      id: 'guest-2',
      name: 'Bob Rodriguez',
      email: 'bob.rodriguez@company.com',
      preferences: { responseDelay: 3000, likelyResponse: 'maybe' }
    },
    {
      id: 'guest-3',
      name: 'Carol Williams',
      email: 'carol.williams@company.com',
      preferences: { responseDelay: 1500, likelyResponse: 'yes' }
    },
    {
      id: 'guest-4',
      name: 'David Kim',
      email: 'david.kim@company.com',
      preferences: { responseDelay: 4000, likelyResponse: 'no' }
    },
    {
      id: 'guest-5',
      name: 'Emma Thompson',
      email: 'emma.thompson@company.com',
      preferences: { responseDelay: 2500, likelyResponse: 'random' }
    }
  ];

  const addMessage = useCallback((message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: `msg_${Date.now()}_${Math.random()}`,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  }, []);

  const updateMessageStatus = useCallback((messageId: string, status: Message['status']) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, status } : msg
      )
    );
  }, []);

  const generateGuestResponse = (guest: Guest, invitation: EventInvitation): GuestResponse => {
    let response: 'yes' | 'no' | 'maybe';
    
    if (guest.preferences.likelyResponse === 'random') {
      const responses: ('yes' | 'no' | 'maybe')[] = ['yes', 'no', 'maybe'];
      response = responses[Math.floor(Math.random() * responses.length)];
    } else {
      // Add some randomness even for preferred responses
      const random = Math.random();
      if (random < 0.7) {
        response = guest.preferences.likelyResponse as 'yes' | 'no' | 'maybe';
      } else {
        const alternatives: Record<string, ('yes' | 'no' | 'maybe')[]> = {
          'yes': ['maybe', 'no'],
          'no': ['maybe', 'yes'],
          'maybe': ['yes', 'no']
        };
        const alts = alternatives[guest.preferences.likelyResponse] || ['maybe'];
        response = alts[Math.floor(Math.random() * alts.length)];
      }
    }

    const messages = {
      yes: [
        "Looking forward to it!",
        "Count me in!",
        "Sounds great, I'll be there!",
        "Yes, definitely attending!",
        "Can't wait!"
      ],
      no: [
        "Sorry, I have a conflict.",
        "Unfortunately, I can't make it.",
        "I have another commitment.",
        "Sorry, won't be able to attend.",
        "Previous engagement, sorry!"
      ],
      maybe: [
        "I'll try my best to make it.",
        "Tentatively yes, but might change.",
        "Let me check my schedule.",
        "Possibly, depends on other meetings.",
        "I'll confirm closer to the date."
      ]
    };

    return {
      id: `resp_${Date.now()}_${guest.id}`,
      invitationId: invitation.id,
      guestName: guest.name,
      response,
      message: messages[response][Math.floor(Math.random() * messages[response].length)],
      timestamp: Date.now()
    };
  };

  const sendInvitation = useCallback((invitation: EventInvitation) => {
    // Clear previous state
    setCurrentInvitation(null);
    setGuestResponses([]);
    setEventSummary(null);
    
    // Clear any existing timeouts
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    setSystemStatus(prev => ({ ...prev, host: 'active' }));

    // Step 1: Host sends invitation to Coordinator
    const hostToCoordinatorMsg = addMessage({
      type: 'invitation',
      from: 'Event Host',
      to: 'Coordinator',
      content: invitation,
      status: 'sending'
    });

    const timeout1 = setTimeout(() => {
      updateMessageStatus(hostToCoordinatorMsg.id, 'delivered');
      setSystemStatus(prev => ({ ...prev, host: 'processing', coordinator: 'active' }));
      
      const timeout2 = setTimeout(() => {
        updateMessageStatus(hostToCoordinatorMsg.id, 'processed');
        setCurrentInvitation(invitation);
        setSystemStatus(prev => ({ ...prev, coordinator: 'processing', guests: 'active' }));

        // Step 2: Coordinator forwards invitation to all guests
        guests.forEach((guest, index) => {
          const coordinatorToGuestMsg = addMessage({
            type: 'invitation',
            from: 'Coordinator',
            to: guest.name,
            content: invitation,
            status: 'sending'
          });

          const timeout3 = setTimeout(() => {
            updateMessageStatus(coordinatorToGuestMsg.id, 'delivered');
            
            const timeout4 = setTimeout(() => {
              updateMessageStatus(coordinatorToGuestMsg.id, 'processed');
            }, 300);
            timeoutsRef.current.push(timeout4);
          }, 500 + index * 200);
          timeoutsRef.current.push(timeout3);
        });

        // Step 3: Guests respond after their individual delays
        guests.forEach((guest) => {
          const timeout5 = setTimeout(() => {
            const response = generateGuestResponse(guest, invitation);
            
            const guestToCoordinatorMsg = addMessage({
              type: 'response',
              from: guest.name,
              to: 'Coordinator',
              content: response,
              status: 'sending'
            });

            const timeout6 = setTimeout(() => {
              updateMessageStatus(guestToCoordinatorMsg.id, 'delivered');
              
              const timeout7 = setTimeout(() => {
                updateMessageStatus(guestToCoordinatorMsg.id, 'processed');
                setGuestResponses(prev => [...prev, response]);
              }, 300);
              timeoutsRef.current.push(timeout7);
            }, 500);
            timeoutsRef.current.push(timeout6);
          }, 2000 + guest.preferences.responseDelay);
          timeoutsRef.current.push(timeout5);
        });

        // Step 4: After all responses, Coordinator sends summary to Host
        const maxDelay = Math.max(...guests.map(g => g.preferences.responseDelay));
        const timeout8 = setTimeout(() => {
          setSystemStatus(prev => ({ ...prev, guests: 'processing' }));
          
          const timeout9 = setTimeout(() => {
            // Create summary
            const allResponses = guests.map(guest => generateGuestResponse(guest, invitation));
            const summary: EventSummary = {
              id: `summary_${Date.now()}`,
              invitationId: invitation.id,
              totalInvited: guests.length,
              totalResponses: guests.length,
              yesCount: allResponses.filter(r => r.response === 'yes').length,
              noCount: allResponses.filter(r => r.response === 'no').length,
              maybeCount: allResponses.filter(r => r.response === 'maybe').length,
              responses: allResponses,
              timestamp: Date.now()
            };

            const coordinatorToHostMsg = addMessage({
              type: 'summary',
              from: 'Coordinator',
              to: 'Event Host',
              content: summary,
              status: 'sending'
            });

            const timeout10 = setTimeout(() => {
              updateMessageStatus(coordinatorToHostMsg.id, 'delivered');
              
              const timeout11 = setTimeout(() => {
                updateMessageStatus(coordinatorToHostMsg.id, 'processed');
                setEventSummary(summary);
                setSystemStatus({ host: 'idle', coordinator: 'idle', guests: 'idle' });
              }, 500);
              timeoutsRef.current.push(timeout11);
            }, 800);
            timeoutsRef.current.push(timeout10);
          }, 1000);
          timeoutsRef.current.push(timeout9);
        }, 3000 + maxDelay);
        timeoutsRef.current.push(timeout8);
      }, 1000);
      timeoutsRef.current.push(timeout2);
    }, 800);
    timeoutsRef.current.push(timeout1);
  }, [addMessage, updateMessageStatus]);

  const resetSystem = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    
    setMessages([]);
    setCurrentInvitation(null);
    setGuestResponses([]);
    setEventSummary(null);
    setSystemStatus({ host: 'idle', coordinator: 'idle', guests: 'idle' });
  }, []);

  return {
    messages,
    currentInvitation,
    guestResponses,
    eventSummary,
    systemStatus,
    guests,
    sendInvitation,
    resetSystem
  };
};