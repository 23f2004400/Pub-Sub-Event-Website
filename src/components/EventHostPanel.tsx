import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, User, Send } from 'lucide-react';
import { EventInvitation } from '../types/EventSystem';

interface EventHostPanelProps {
  onSendInvitation: (invitation: EventInvitation) => void;
  isActive: boolean;
}

export const EventHostPanel: React.FC<EventHostPanelProps> = ({ 
  onSendInvitation, 
  isActive 
}) => {
  const [formData, setFormData] = useState({
    eventName: 'Team Building Workshop',
    eventDate: '2025-02-15',
    eventTime: '14:00',
    location: 'Conference Room A',
    description: 'Join us for an engaging team building session with fun activities and networking.',
    hostName: 'Sarah Johnson'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const invitation: EventInvitation = {
      id: `inv_${Date.now()}`,
      ...formData,
      timestamp: Date.now()
    };
    
    onSendInvitation(invitation);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Calendar className="inline w-4 h-4 mr-1" />
            Event Name
          </label>
          <input
            type="text"
            value={formData.eventName}
            onChange={(e) => handleInputChange('eventName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isActive}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Calendar className="inline w-4 h-4 mr-1" />
              Date
            </label>
            <input
              type="date"
              value={formData.eventDate}
              onChange={(e) => handleInputChange('eventDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isActive}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Clock className="inline w-4 h-4 mr-1" />
              Time
            </label>
            <input
              type="time"
              value={formData.eventTime}
              onChange={(e) => handleInputChange('eventTime', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isActive}
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <MapPin className="inline w-4 h-4 mr-1" />
            Location
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isActive}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <User className="inline w-4 h-4 mr-1" />
            Host Name
          </label>
          <input
            type="text"
            value={formData.hostName}
            onChange={(e) => handleInputChange('hostName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isActive}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isActive}
          />
        </div>
        
        <motion.button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isActive}
          whileHover={!isActive ? { scale: 1.02 } : {}}
          whileTap={!isActive ? { scale: 0.98 } : {}}
        >
          <Send size={16} />
          <span>{isActive ? 'Processing...' : 'Send Invitation'}</span>
        </motion.button>
      </form>
    </div>
  );
};