import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, Users, BarChart3 } from 'lucide-react';
import { EventInvitation, GuestResponse, EventSummary } from '../types/EventSystem';

interface CoordinatorPanelProps {
  currentInvitation: EventInvitation | null;
  guestResponses: GuestResponse[];
  eventSummary: EventSummary | null;
  totalGuests: number;
  isProcessing: boolean;
}

export const CoordinatorPanel: React.FC<CoordinatorPanelProps> = ({
  currentInvitation,
  guestResponses,
  eventSummary,
  totalGuests,
  isProcessing
}) => {
  const getResponseIcon = (response: string) => {
    switch (response) {
      case 'yes': return '✅';
      case 'no': return '❌';
      case 'maybe': return '❓';
      default: return '⏳';
    }
  };

  return (
    <div className="space-y-4">
      {currentInvitation ? (
        <>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">Current Event</h4>
            <p className="text-blue-700 text-sm">{currentInvitation.eventName}</p>
            <p className="text-blue-600 text-xs">
              {currentInvitation.eventDate} at {currentInvitation.eventTime}
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-800 flex items-center">
                <Users className="w-4 h-4 mr-1" />
                Guest Responses ({guestResponses.length}/{totalGuests})
              </h4>
              {isProcessing && (
                <div className="flex items-center text-orange-600">
                  <Clock className="w-4 h-4 mr-1 animate-spin" />
                  <span className="text-xs">Processing...</span>
                </div>
              )}
            </div>
            
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {guestResponses.map((response) => (
                <motion.div
                  key={response.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded"
                >
                  <span className="font-medium">{response.guestName}</span>
                  <div className="flex items-center space-x-2">
                    <span>{getResponseIcon(response.response)}</span>
                    <span className="capitalize text-gray-600">{response.response}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          {eventSummary && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-50 p-4 rounded-lg border border-green-200"
            >
              <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                <BarChart3 className="w-4 h-4 mr-1" />
                Final Summary
              </h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">{eventSummary.yesCount}</div>
                  <div className="text-xs text-green-700">Attending</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-600">{eventSummary.maybeCount}</div>
                  <div className="text-xs text-yellow-700">Maybe</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">{eventSummary.noCount}</div>
                  <div className="text-xs text-red-700">Can't Attend</div>
                </div>
              </div>
            </motion.div>
          )}
        </>
      ) : (
        <div className="text-center text-gray-500 py-8">
          <Clock className="w-12 h-12 mx-auto mb-2 text-gray-400" />
          <p>Waiting for event invitation...</p>
        </div>
      )}
    </div>
  );
};