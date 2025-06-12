import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Send, MessageSquare, Users } from 'lucide-react';
import { Message } from '../types/EventSystem';

interface MessageFlowProps {
  messages: Message[];
}

export const MessageFlow: React.FC<MessageFlowProps> = ({ messages }) => {
  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'invitation': return Send;
      case 'response': return MessageSquare;
      case 'summary': return Users;
      default: return MessageSquare;
    }
  };

  const getMessageColor = (type: string) => {
    switch (type) {
      case 'invitation': return 'blue';
      case 'response': return 'green';
      case 'summary': return 'purple';
      default: return 'gray';
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <ArrowRight className="mr-2 text-blue-500" />
        Message Flow
      </h3>
      
      <div className="space-y-3 max-h-64 overflow-y-auto">
        <AnimatePresence>
          {messages.slice(-10).map((message) => {
            const Icon = getMessageIcon(message.type);
            const color = getMessageColor(message.type);
            
            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={`flex items-center p-3 bg-${color}-50 border border-${color}-200 rounded-lg`}
              >
                <div className={`p-2 bg-${color}-500 text-white rounded-lg mr-3`}>
                  <Icon size={16} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-800">
                    {message.from} → {message.to}
                  </div>
                  <div className="text-xs text-gray-600 capitalize">
                    {message.type} • {message.status}
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {messages.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No messages yet. Create an event to start the flow!
          </div>
        )}
      </div>
    </div>
  );
};