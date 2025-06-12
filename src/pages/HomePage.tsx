import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Users, MessageSquare, User, Play, BarChart3 } from 'lucide-react';
import { MessageFlow } from '../components/MessageFlow';
import { SummaryDisplay } from '../components/SummaryDisplay';

interface HomePageProps {
  messages: any[];
  currentInvitation: any;
  eventSummary: any;
  systemStatus: any;
  guests: any[];
  sendInvitation: (invitation: any) => void;
  resetSystem: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  messages,
  currentInvitation,
  eventSummary,
  systemStatus,
  guests,
  sendInvitation,
  resetSystem
}) => {
  const isSystemActive = Object.values(systemStatus).some(status => status !== 'idle');

  const handleQuickDemo = () => {
    const demoInvitation = {
      id: `demo_${Date.now()}`,
      eventName: 'Team Building Workshop',
      eventDate: '2025-02-15',
      eventTime: '14:00',
      location: 'Conference Room A',
      description: 'Join us for an engaging team building session with fun activities and networking.',
      hostName: 'Sarah Johnson',
      timestamp: Date.now()
    };
    sendInvitation(demoInvitation);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Zap className="w-4 h-4 text-yellow-300" />
              <span className="text-white/90 text-sm font-medium">Distributed Event Planning System</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              EventFlow
              <span className="block text-3xl md:text-4xl font-normal text-blue-200 mt-2">
                Pub/Sub Architecture
              </span>
            </h1>
            
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Experience a real-time distributed event planning system built with Redis Streams. 
              Watch as messages flow seamlessly between hosts, coordinators, and guests.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                onClick={handleQuickDemo}
                disabled={isSystemActive}
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={!isSystemActive ? { scale: 1.05 } : {}}
                whileTap={!isSystemActive ? { scale: 0.95 } : {}}
              >
                <Play size={20} />
                <span>{isSystemActive ? 'Demo Running...' : 'Start Quick Demo'}</span>
              </motion.button>
              
              <motion.button
                onClick={resetSystem}
                className="bg-white/10 backdrop-blur-sm text-white border border-white/20 px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Reset System
              </motion.button>
            </div>
          </motion.div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-400/20 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-blue-400/20 rounded-full blur-xl"></div>
      </section>

      {/* Architecture Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">System Architecture</h2>
            
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Event Host',
                description: 'Creates and publishes event invitations, receives final summaries',
                icon: User,
                color: 'blue',
                link: '/host',
                features: ['Create Events', 'Publish Invitations', 'Receive Summaries']
              },
              {
                title: 'Coordinator',
                description: 'Routes messages, collects responses, generates comprehensive summaries',
                icon: MessageSquare,
                color: 'orange',
                link: '/coordinator',
                features: ['Message Routing', 'Response Collection', 'Summary Generation']
              },
              {
                title: 'Event Guests',
                description: 'Receive invitations, make decisions, send attendance confirmations',
                icon: Users,
                color: 'green',
                link: '/guests',
                features: ['Receive Invitations', 'Make Decisions', 'Send Responses']
              }
            ].map((component, index) => (
              <motion.div
                key={component.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <Link to={component.link}>
                  <div className={`bg-gradient-to-br from-${component.color}-50 to-${component.color}-100 p-8 rounded-2xl border border-${component.color}-200 hover:shadow-xl transition-all duration-300 group-hover:scale-105`}>
                    <div className={`w-16 h-16 bg-${component.color}-500 text-white rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      <component.icon size={32} />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">{component.title}</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">{component.description}</p>
                    
                    <ul className="space-y-2 mb-6">
                      {component.features.map((feature) => (
                        <li key={feature} className="flex items-center text-sm text-gray-700">
                          <div className={`w-2 h-2 bg-${component.color}-400 rounded-full mr-3`}></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <div className={`flex items-center text-${component.color}-600 font-semibold group-hover:text-${component.color}-700`}>
                      <span>Explore Component</span>
                      <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Live System Status */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Live System Monitor</h2>
            <p className="text-xl text-gray-600">
              Real-time visualization of message flow and system activity
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <MessageFlow messages={messages} />
            <SummaryDisplay eventSummary={eventSummary} currentInvitation={currentInvitation} />
          </div>
        </div>
      </section>

      {/* System Stats */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { label: 'Total Messages', value: messages.length, icon: MessageSquare },
              { label: 'Active Guests', value: guests.length, icon: Users },
              { label: 'System Status', value: isSystemActive ? 'Active' : 'Idle', icon: Zap },
              { label: 'Events Processed', value: eventSummary ? '1' : '0', icon: BarChart3 }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl"
              >
                <div className="w-12 h-12 bg-blue-500 text-white rounded-lg flex items-center justify-center mx-auto mb-4">
                  <stat.icon size={24} />
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Why EventFlow?</h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Built with modern distributed systems principles for reliability, scalability, and performance
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Redis Streams',
                description: 'Reliable message delivery with consumer groups and acknowledgments',
                icon: '🚀'
              },
              {
                title: 'Decoupled Architecture',
                description: 'Independent components that can scale and deploy separately',
                icon: '🔧'
              },
              {
                title: 'Real-time Updates',
                description: 'Live message flow visualization and instant status updates',
                icon: '⚡'
              },
              {
                title: 'Fault Tolerance',
                description: 'Graceful error handling and automatic recovery mechanisms',
                icon: '🛡️'
              },
              {
                title: 'Scalable Design',
                description: 'Horizontal scaling support for high-volume event processing',
                icon: '📈'
              },
              {
                title: 'Production Ready',
                description: 'Enterprise-grade patterns with monitoring and observability',
                icon: '🎯'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-blue-100 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};