import React from 'react';
import { motion } from 'framer-motion';
import { User, Send, Calendar, MapPin, Clock, FileText, ArrowRight, CheckCircle } from 'lucide-react';
import { EventHostPanel } from '../components/EventHostPanel';

interface EventHostPageProps {
  messages: any[];
  currentInvitation: any;
  eventSummary: any;
  systemStatus: any;
  sendInvitation: (invitation: any) => void;
  resetSystem: () => void;
}

export const EventHostPage: React.FC<EventHostPageProps> = ({
  messages,
  currentInvitation,
  eventSummary,
  systemStatus,
  sendInvitation,
  resetSystem
}) => {
  const isActive = systemStatus.host !== 'idle';

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <User className="w-4 h-4 text-blue-200" />
              <span className="text-white/90 text-sm font-medium">Event Host Dashboard</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Create & Manage
              <span className="block text-blue-200">Your Events</span>
            </h1>
            
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Design beautiful events, send invitations to guests, and receive comprehensive summaries 
              through our distributed Pub/Sub system.
            </p>
          </motion.div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/5 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-blue-400/10 rounded-full blur-xl"></div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Event Creation Form */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-2xl shadow-xl p-8"
              >
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-blue-500 text-white rounded-xl flex items-center justify-center mr-4">
                    <Send size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Create Event Invitation</h2>
                    <p className="text-gray-600">Design your event and invite guests through Redis Streams</p>
                  </div>
                </div>

                <EventHostPanel
                  onSendInvitation={sendInvitation}
                  isActive={isActive}
                />
              </motion.div>
            </div>

            {/* Status Panel */}
            <div className="space-y-6">
              {/* System Status */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-white rounded-2xl shadow-xl p-6"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${isActive ? 'bg-green-400 animate-pulse' : 'bg-gray-300'}`}></div>
                  Host Status
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Status</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {systemStatus.host === 'idle' ? 'Ready' : 
                       systemStatus.host === 'active' ? 'Publishing' : 'Processing'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Messages Sent</span>
                    <span className="font-semibold text-gray-800">
                      {messages.filter(m => m.from === 'Event Host').length}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Current Event</span>
                    <span className="font-semibold text-gray-800">
                      {currentInvitation ? 'Active' : 'None'}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Process Flow */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-2xl shadow-xl p-6"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-4">Process Flow</h3>
                
                <div className="space-y-4">
                  {[
                    { step: 1, title: 'Create Event', icon: Calendar, completed: !!currentInvitation },
                    { step: 2, title: 'Publish Invitation', icon: Send, completed: !!currentInvitation },
                    { step: 3, title: 'Coordinator Routes', icon: ArrowRight, completed: systemStatus.coordinator !== 'idle' },
                    { step: 4, title: 'Guests Respond', icon: User, completed: messages.some(m => m.type === 'response') },
                    { step: 5, title: 'Receive Summary', icon: CheckCircle, completed: !!eventSummary }
                  ].map((item) => (
                    <div key={item.step} className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        item.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                      }`}>
                        <item.icon size={16} />
                      </div>
                      <div className="flex-1">
                        <span className={`text-sm font-medium ${
                          item.completed ? 'text-gray-800' : 'text-gray-500'
                        }`}>
                          {item.title}
                        </span>
                      </div>
                      {item.completed && (
                        <CheckCircle size={16} className="text-green-500" />
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white rounded-2xl shadow-xl p-6"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
                
                <div className="space-y-3">
                  <button
                    onClick={resetSystem}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors"
                  >
                    Reset System
                  </button>
                  
                  <button
                    onClick={() => {
                      const demoEvent = {
                        id: `demo_${Date.now()}`,
                        eventName: 'Team Building Workshop',
                        eventDate: '2025-02-15',
                        eventTime: '14:00',
                        location: 'Conference Room A',
                        description: 'Join us for an engaging team building session.',
                        hostName: 'Sarah Johnson',
                        timestamp: Date.now()
                      };
                      sendInvitation(demoEvent);
                    }}
                    disabled={isActive}
                    className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                  >
                    Quick Demo Event
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Event Summary Section */}
      {eventSummary && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-8 border border-green-200"
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-green-500 text-white rounded-xl flex items-center justify-center mr-4">
                  <CheckCircle size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Event Summary Received!</h2>
                  <p className="text-gray-600">Your event responses have been collected and processed</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-green-600">{eventSummary.yesCount}</div>
                  <div className="text-sm text-gray-600">Attending</div>
                </div>
                <div className="bg-white p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-yellow-600">{eventSummary.maybeCount}</div>
                  <div className="text-sm text-gray-600">Maybe</div>
                </div>
                <div className="bg-white p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-red-600">{eventSummary.noCount}</div>
                  <div className="text-sm text-gray-600">Can't Attend</div>
                </div>
                <div className="bg-white p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round((eventSummary.yesCount / eventSummary.totalInvited) * 100)}%
                  </div>
                  <div className="text-sm text-gray-600">Attendance Rate</div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Host Features</h2>
            <p className="text-xl text-gray-600">Everything you need to create and manage successful events</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Calendar,
                title: 'Event Creation',
                description: 'Intuitive form to create detailed event invitations with all necessary information'
              },
              {
                icon: Send,
                title: 'Redis Pub/Sub',
                description: 'Reliable message delivery through Redis Streams with guaranteed processing'
              },
              {
                icon: FileText,
                title: 'Comprehensive Reports',
                description: 'Detailed summaries with attendance statistics and guest responses'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-lg"
              >
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};