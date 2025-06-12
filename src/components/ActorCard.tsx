import React from 'react';
import { motion } from 'framer-motion';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface ActorCardProps {
  title: string;
  subtitle: string;
  icon: typeof LucideIcon;
  color: string;
  status: 'idle' | 'active' | 'processing';
  children: React.ReactNode;
  messageCount?: number;
}

export const ActorCard: React.FC<ActorCardProps> = ({
  title,
  subtitle,
  icon: Icon,
  color,
  status,
  children,
  messageCount = 0
}) => {
  const statusColors = {
    idle: 'bg-gray-100 border-gray-200',
    active: `bg-${color}-50 border-${color}-200`,
    processing: `bg-${color}-100 border-${color}-300`
  };

  return (
    <motion.div
      className={`relative p-6 rounded-xl border-2 transition-all duration-300 ${statusColors[status]}`}
      whileHover={{ scale: 1.02 }}
      animate={{
        boxShadow: status === 'processing' 
          ? '0 0 20px rgba(59, 130, 246, 0.3)' 
          : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}
    >
      {messageCount > 0 && (
        <motion.div
          className={`absolute -top-2 -right-2 w-6 h-6 bg-${color}-500 text-white rounded-full flex items-center justify-center text-xs font-bold`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500 }}
        >
          {messageCount}
        </motion.div>
      )}
      
      <div className="flex items-center mb-4">
        <div className={`p-3 bg-${color}-500 text-white rounded-lg mr-4`}>
          <Icon size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
          <p className="text-gray-600">{subtitle}</p>
        </div>
      </div>
      
      <div className="space-y-4">
        {children}
      </div>
    </motion.div>
  );
};