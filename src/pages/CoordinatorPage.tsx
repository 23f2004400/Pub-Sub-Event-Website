import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, ArrowRight, Users, BarChart3, Zap, Shield, Clock } from 'lucide-react';
import { CoordinatorPanel } from '../components/CoordinatorPanel';
import { MessageFlow } from '../components/MessageFlow';

interface CoordinatorPageProps {
  messages: any[];
  currentInvitation: any;
  guestResponses: any[];
  eventSummary: any;
  systemStatus: any;
  guests: any[];
}

export const CoordinatorPage: React.FC<CoordinatorPageProps> = ({
  messages,
  currentInvitation,
  guestResponses,
  eventSummary,
  systemStatus,
  guests
}) => {
  const isProcessing = systemStatus.coordinator === 'processing';
  const isActive = systemStatus.coordinator !== 'idle';

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-red-500 to-pink-600">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <MessageSquare className="w-4 h-4 text-orange-200" />
              <span className="text-white/90 text-sm font-medium">Coordinator Service</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Message Router
              <span className="block text-orange-200">& Orchestrator</span>
            </h1>
            
            <p className="text-xl text-orange-100 mb-8 max-w-3xl mx-auto">
              The central nervous system of our distributed event planning platform. 
              Routes messages, collects responses, and generates comprehensive summaries.
            </p>
          </motion.div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/5 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-orange-400/10 rounded-full blur-xl"></div>
      </section>

      {/* Main Dashboard */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Coordinator Panel */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-2xl shadow-xl p-8"
              >
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-orange-500 text-white rounded-xl flex items-center justify-center mr-4">
                    <MessageSquare size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Coordination Dashboard</h2>
                    <p className="text-gray-600">Real-time message processing and response collection</p>
                  </div>
                </div>

                <CoordinatorPanel
                  currentInvitation={currentInvitation}
                  guestResponses={guestResponses}
                  eventSummary={eventSummary}
                  totalGuests={guests.length}
                  isProcessing={isProcessing}
                />
              </motion.div>
            </div>

            {/* Status & Metrics */}
            <div className="space-y-6">
              {/* System Status */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-white rounded-2xl shadow-xl p-6"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${isActive ? 'bg-orange-400 animate-pulse' : 'bg-gray-300'}`}></div>
                  Coordinator Status
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Status</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      isActive ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {systemStatus.coordinator === 'idle' ? 'Listening' : 
                       systemStatus.coordinator === 'active' ? 'Routing' : 'Processing'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Messages Processed</span>
                    <span className="font-semibold text-gray-800">
                      {messages.filter(m => m.to === 'Coordinator' && m.status === 'processed').length}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Active Streams</span>
                    <span className="font-semibold text-gray-800">3</span>
                  </div>
                </div>
              </motion.div>

              {/* Message Routing Stats */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-2xl shadow-xl p-6"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-4">Message Routing</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center">
                      <ArrowRight className="w-4 h-4 text-blue-500 mr-2" />
                      <span className="text-sm font-medium text-blue-800">Invitations</span>
                    </div>
                    <span className="text-blue-600 font-semibold">
                      {messages.filter(m => m.type === 'invitation').length}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center">
                      <ArrowRight className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-sm font-medium text-green-800">Responses</span>
                    </div>
                    <span className="text-green-600 font-semibold">
                      {messages.filter(m => m.type === 'response').length}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center">
                      <ArrowRight className="w-4 h-4 text-purple-500 mr-2" />
                      <span className="text-sm font-medium text-purple-800">Summaries</span>
                    </div>
                    <span className="text-purple-600 font-semibold">
                      {messages.filter(m => m.type === 'summary').length}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Performance Metrics */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white rounded-2xl shadow-xl p-6"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-4">Performance</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-800">
                      {currentInvitation ? guestResponses.length : 0}
                    </div>
                    <div className="text-xs text-gray-600">Responses</div>
                  </div>
                  
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-800">
                      {currentInvitation ? guests.length : 0}
                    </div>
                    <div className="text-xs text-gray-600">Expected</div>
                  </div>
                  
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-800">
                      {currentInvitation && guestResponses.length === guests.length ? '100' : '0'}%
                    </div>
                    <div className="text-xs text-gray-600">Complete</div>
                  </div>
                  
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-800">
                      <Clock size={16} className="inline" />
                    </div>
                    <div className="text-xs text-gray-600">Real-time</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Message Flow Visualization */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Live Message Flow</h2>
            <p className="text-xl text-gray-600">Real-time visualization of message routing and processing</p>
          </motion.div>

          <MessageFlow messages={messages} />
        </div>
      </section>

      {/* Architecture Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Coordinator Features</h2>
            <p className="text-xl text-gray-600">Built for reliability, scalability, and performance</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: 'High Performance',
                description: 'Processes thousands of messages per second with Redis Streams optimization',
                color: 'yellow'
              },
              {
                icon: Shield,
                title: 'Fault Tolerance',
                description: 'Consumer groups ensure reliable delivery with automatic acknowledgments',
                color: 'green'
              },
              {
                icon: BarChart3,
                title: 'Smart Analytics',
                description: 'Generates comprehensive summaries with detailed response analytics',
                color: 'blue'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-lg"
              >
                <div className={`w-12 h-12 bg-${feature.color}-100 text-${feature.color}-600 rounded-lg flex items-center justify-center mb-4`}>
                  <feature.icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Redis Streams Info */}
      <section className="py-16 bg-gradient-to-br from-orange-500 to-red-600">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Powered by Redis Streams</h2>
            <p className="text-xl text-orange-100">Enterprise-grade message streaming with built-in reliability</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Consumer Groups', description: 'Load balancing and fault tolerance' },
              { title: 'Message Persistence', description: 'Durable storage with replay capability' },
              { title: 'Acknowledgments', description: 'Guaranteed message processing' },
              { title: 'Horizontal Scaling', description: 'Multiple coordinator instances' }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20"
              >
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-orange-100 text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};