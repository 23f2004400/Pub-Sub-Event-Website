import React from 'react';
import { motion } from 'framer-motion';
import { Users, User, Clock, CheckCircle, XCircle, HelpCircle, Heart } from 'lucide-react';
import { GuestPanel } from '../components/GuestPanel';

interface EventGuestsPageProps {
  messages: any[];
  currentInvitation: any;
  guestResponses: any[];
  systemStatus: any;
  guests: any[];
}

export const EventGuestsPage: React.FC<EventGuestsPageProps> = ({
  messages,
  currentInvitation,
  guestResponses,
  systemStatus,
  guests
}) => {
  const isProcessing = systemStatus.guests === 'processing';
  const isActive = systemStatus.guests !== 'idle';

  const getResponseStats = () => {
    const yes = guestResponses.filter(r => r.response === 'yes').length;
    const no = guestResponses.filter(r => r.response === 'no').length;
    const maybe = guestResponses.filter(r => r.response === 'maybe').length;
    return { yes, no, maybe };
  };

  const stats = getResponseStats();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-500 via-emerald-600 to-teal-700">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Users className="w-4 h-4 text-green-200" />
              <span className="text-white/90 text-sm font-medium">Event Guests Dashboard</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Guest Response
              <span className="block text-green-200">Management</span>
            </h1>
            
            <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto">
              Watch as our intelligent guest system receives invitations, makes decisions based on 
              unique preferences, and sends responses through Redis Streams.
            </p>

            <div className="flex justify-center space-x-8 text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold text-white">{guests.length}</div>
                <div className="text-green-200 text-sm">Active Guests</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold text-white">{guestResponses.length}</div>
                <div className="text-green-200 text-sm">Responses</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold text-white">
                  {currentInvitation && guestResponses.length === guests.length ? '100' : '0'}%
                </div>
                <div className="text-green-200 text-sm">Complete</div>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/5 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-green-400/10 rounded-full blur-xl"></div>
      </section>

      {/* Main Dashboard */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Guest Panel */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-2xl shadow-xl p-8"
              >
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-green-500 text-white rounded-xl flex items-center justify-center mr-4">
                    <Users size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Guest Response System</h2>
                    <p className="text-gray-600">AI-powered guests with unique personalities and preferences</p>
                  </div>
                </div>

                <GuestPanel
                  guests={guests}
                  currentInvitation={currentInvitation}
                  guestResponses={guestResponses}
                  isProcessing={isProcessing}
                />
              </motion.div>
            </div>

            {/* Status & Analytics */}
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
                  Guest Status
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Status</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {systemStatus.guests === 'idle' ? 'Waiting' : 
                       systemStatus.guests === 'active' ? 'Responding' : 'Processing'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Active Guests</span>
                    <span className="font-semibold text-gray-800">{guests.length}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Responses Sent</span>
                    <span className="font-semibold text-gray-800">
                      {messages.filter(m => m.type === 'response').length}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Response Statistics */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-2xl shadow-xl p-6"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-4">Response Breakdown</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span className="font-medium text-green-800">Attending</span>
                    </div>
                    <span className="text-2xl font-bold text-green-600">{stats.yes}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center">
                      <HelpCircle className="w-5 h-5 text-yellow-500 mr-3" />
                      <span className="font-medium text-yellow-800">Maybe</span>
                    </div>
                    <span className="text-2xl font-bold text-yellow-600">{stats.maybe}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center">
                      <XCircle className="w-5 h-5 text-red-500 mr-3" />
                      <span className="font-medium text-red-800">Can't Attend</span>
                    </div>
                    <span className="text-2xl font-bold text-red-600">{stats.no}</span>
                  </div>
                </div>
              </motion.div>

              {/* Guest Personalities */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white rounded-2xl shadow-xl p-6"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-4">Guest Personalities</h3>
                
                <div className="space-y-3">
                  {guests.map((guest, index) => (
                    <div key={guest.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-3 ${
                          guest.preferences.likelyResponse === 'yes' ? 'bg-green-400' :
                          guest.preferences.likelyResponse === 'no' ? 'bg-red-400' :
                          guest.preferences.likelyResponse === 'maybe' ? 'bg-yellow-400' :
                          'bg-purple-400'
                        }`}></div>
                        <span className="text-sm font-medium text-gray-800">{guest.name}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {guest.preferences.likelyResponse === 'random' ? '🎲' : 
                         guest.preferences.likelyResponse === 'yes' ? '😊' :
                         guest.preferences.likelyResponse === 'no' ? '😔' : '🤔'}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Guest Profiles */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Meet Our AI Guests</h2>
            <p className="text-xl text-gray-600">Each guest has unique preferences and response patterns</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guests.map((guest, index) => {
              const response = guestResponses.find(r => r.guestName === guest.name);
              
              return (
                <motion.div
                  key={guest.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`bg-gradient-to-br p-6 rounded-xl border-2 transition-all duration-300 ${
                    response 
                      ? response.response === 'yes' 
                        ? 'from-green-50 to-emerald-100 border-green-200' 
                        : response.response === 'no'
                          ? 'from-red-50 to-rose-100 border-red-200'
                          : 'from-yellow-50 to-amber-100 border-yellow-200'
                      : 'from-gray-50 to-slate-100 border-gray-200'
                  }`}
                >
                  <div className="flex items-center mb-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold mr-4 ${
                      guest.preferences.likelyResponse === 'yes' ? 'bg-green-500' :
                      guest.preferences.likelyResponse === 'no' ? 'bg-red-500' :
                      guest.preferences.likelyResponse === 'maybe' ? 'bg-yellow-500' :
                      'bg-purple-500'
                    }`}>
                      {guest.name.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">{guest.name}</h3>
                      <p className="text-sm text-gray-600">{guest.email}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tendency:</span>
                      <span className="font-medium capitalize">{guest.preferences.likelyResponse}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Response Time:</span>
                      <span className="font-medium">{guest.preferences.responseDelay / 1000}s</span>
                    </div>
                  </div>
                  
                  {response ? (
                    <div className={`p-3 rounded-lg ${
                      response.response === 'yes' ? 'bg-green-100' :
                      response.response === 'no' ? 'bg-red-100' : 'bg-yellow-100'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold capitalize">{response.response}</span>
                        {response.response === 'yes' ? <CheckCircle className="w-4 h-4 text-green-600" /> :
                         response.response === 'no' ? <XCircle className="w-4 h-4 text-red-600" /> :
                         <HelpCircle className="w-4 h-4 text-yellow-600" />}
                      </div>
                      {response.message && (
                        <p className="text-xs text-gray-700 italic">"{response.message}"</p>
                      )}
                    </div>
                  ) : isProcessing ? (
                    <div className="flex items-center justify-center p-3 bg-blue-50 rounded-lg">
                      <Clock className="w-4 h-4 text-blue-500 animate-spin mr-2" />
                      <span className="text-sm text-blue-700">Thinking...</span>
                    </div>
                  ) : (
                    <div className="p-3 bg-gray-100 rounded-lg text-center">
                      <span className="text-sm text-gray-500">Waiting for invitation</span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Guest System Features</h2>
            <p className="text-xl text-gray-600">Intelligent response simulation with realistic behavior patterns</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: User,
                title: 'Unique Personalities',
                description: 'Each guest has distinct preferences and response tendencies for realistic simulation'
              },
              {
                icon: Clock,
                title: 'Variable Timing',
                description: 'Different response delays simulate real-world decision-making patterns'
              },
              {
                icon: Heart,
                title: 'Smart Responses',
                description: 'Contextual messages that match each guest\'s personality and decision'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-lg"
              >
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-4">
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