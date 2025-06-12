import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Clock, CheckCircle, XCircle, HelpCircle } from 'lucide-react';
import { Guest, EventInvitation, GuestResponse } from '../types/EventSystem';

interface GuestPanelProps {
  guests: Guest[];
  currentInvitation: EventInvitation | null;
  guestResponses: GuestResponse[];
  isProcessing: boolean;
}

export const GuestPanel: React.FC<GuestPanelProps> = ({
  guests,
  currentInvitation,
  guestResponses,
  isProcessing
}) => {
  const getResponseIcon = (response: string) => {
    switch (response) {
      case 'yes': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'no': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'maybe': return <HelpCircle className="w-4 h-4 text-yellow-500" />;
      default: return <Clock className="w-4 h-4 text-gray-400 animate-spin" />;
    }
  };

  const getGuestResponse = (guestId: string) => {
    return guestResponses.find(response => response.guestName === guests.find(g => g.id === guestId)?.name);
  };

  return (
    <div className="space-y-4">
      {currentInvitation ? (
        <>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-800 mb-2">New Invitation Received!</h4>
            <p className="text-green-700 font-medium">{currentInvitation.eventName}</p>
            <p className="text-green-600 text-sm">
              📅 {currentInvitation.eventDate} at {currentInvitation.eventTime}
            </p>
            <p className="text-green-600 text-sm">
              📍 {currentInvitation.location}
            </p>
            <p className="text-green-600 text-xs mt-2">
              From: {currentInvitation.hostName}
            </p>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-800 flex items-center">
              <User className="w-4 h-4 mr-1" />
              Guest Responses
            </h4>
            
            <AnimatePresence>
              {guests.map((guest) => {
                const response = getGuestResponse(guest.id);
                const isResponding = isProcessing && !response;
                
                return (
                  <motion.div
                    key={guest.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                      response 
                        ? 'bg-white border-gray-200' 
                        : isResponding
                          ? 'bg-blue-50 border-blue-200'
                          : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-800">{guest.name}</p>
                        <p className="text-xs text-gray-600">{guest.email}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Tendency: {guest.preferences.likelyResponse} • 
                          Delay: {guest.preferences.responseDelay}s
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {response ? (
                          <>
                            {getResponseIcon(response.response)}
                            <span className="text-sm font-medium capitalize">
                              {response.response}
                            </span>
                          </>
                        ) : isResponding ? (
                          <>
                            <Clock className="w-4 h-4 text-blue-500 animate-spin" />
                            <span className="text-sm text-blue-600">Thinking...</span>
                          </>
                        ) : (
                          <span className="text-sm text-gray-400">Waiting...</span>
                        )}
                      </div>
                    </div>
                    
                    {response?.message && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-2 p-2 bg-gray-100 rounded text-xs text-gray-700"
                      >
                        "{response.message}"
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </>
      ) : (
        <div className="text-center text-gray-500 py-8">
          <User className="w-12 h-12 mx-auto mb-2 text-gray-400" />
          <p>No invitation received yet...</p>
          <p className="text-sm mt-1">Guests are waiting for event details</p>
        </div>
      )}
    </div>
  );
};