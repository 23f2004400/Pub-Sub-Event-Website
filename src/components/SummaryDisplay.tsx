import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Users, Calendar, MapPin, CheckCircle } from 'lucide-react';
import { EventSummary, EventInvitation } from '../types/EventSystem';

interface SummaryDisplayProps {
  eventSummary: EventSummary | null;
  currentInvitation: EventInvitation | null;
}

export const SummaryDisplay: React.FC<SummaryDisplayProps> = ({
  eventSummary,
  currentInvitation
}) => {
  if (!eventSummary || !currentInvitation) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="text-center text-gray-500 py-8">
          <BarChart3 className="w-12 h-12 mx-auto mb-2 text-gray-400" />
          <p>Event summary will appear here</p>
        </div>
      </div>
    );
  }

  const attendanceRate = (eventSummary.yesCount / eventSummary.totalInvited) * 100;
  const responseRate = (eventSummary.totalResponses / eventSummary.totalInvited) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-lg"
    >
      <div className="flex items-center mb-6">
        <div className="p-3 bg-purple-500 text-white rounded-lg mr-4">
          <BarChart3 size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">Event Summary</h3>
          <p className="text-gray-600">Final response analysis</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Event Details */}
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <h4 className="font-semibold text-purple-800 mb-3 flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            {currentInvitation.eventName}
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-purple-700 font-medium">Date:</span>
              <p className="text-purple-600">{currentInvitation.eventDate}</p>
            </div>
            <div>
              <span className="text-purple-700 font-medium">Time:</span>
              <p className="text-purple-600">{currentInvitation.eventTime}</p>
            </div>
            <div className="col-span-2">
              <span className="text-purple-700 font-medium flex items-center">
                <MapPin className="w-3 h-3 mr-1" />
                Location:
              </span>
              <p className="text-purple-600">{currentInvitation.location}</p>
            </div>
          </div>
        </div>

        {/* Response Statistics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">{responseRate.toFixed(0)}%</div>
            <div className="text-sm text-blue-700">Response Rate</div>
            <div className="text-xs text-blue-600 mt-1">
              {eventSummary.totalResponses}/{eventSummary.totalInvited} responded
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">{attendanceRate.toFixed(0)}%</div>
            <div className="text-sm text-green-700">Attendance Rate</div>
            <div className="text-xs text-green-600 mt-1">
              {eventSummary.yesCount} confirmed attendees
            </div>
          </div>
        </div>

        {/* Response Breakdown */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
            <Users className="w-4 h-4 mr-2" />
            Response Breakdown
          </h4>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-green-100 p-3 rounded-lg">
              <div className="text-xl font-bold text-green-600">{eventSummary.yesCount}</div>
              <div className="text-sm text-green-700">✅ Attending</div>
            </div>
            
            <div className="bg-yellow-100 p-3 rounded-lg">
              <div className="text-xl font-bold text-yellow-600">{eventSummary.maybeCount}</div>
              <div className="text-sm text-yellow-700">❓ Maybe</div>
            </div>
            
            <div className="bg-red-100 p-3 rounded-lg">
              <div className="text-xl font-bold text-red-600">{eventSummary.noCount}</div>
              <div className="text-sm text-red-700">❌ Can't Attend</div>
            </div>
          </div>
        </div>

        {/* Confirmed Attendees */}
        {eventSummary.responses.filter(r => r.response === 'yes').length > 0 && (
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-800 mb-3 flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Confirmed Attendees
            </h4>
            <div className="space-y-2">
              {eventSummary.responses
                .filter(response => response.response === 'yes')
                .map((response) => (
                  <div key={response.id} className="flex items-center justify-between text-sm">
                    <span className="font-medium text-green-800">{response.guestName}</span>
                    {response.message && (
                      <span className="text-green-600 italic text-xs">"{response.message}"</span>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};