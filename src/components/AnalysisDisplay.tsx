
import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, 
  TrendingUp, 
  Users, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  PieChart,
  ChevronRight
} from 'lucide-react';
import { scaleAnimation } from '@/utils/animation';

interface AnalysisDisplayProps {
  analysis: {
    metrics: {
      revenue: string;
      growth: string;
      customers: string;
      churn: string;
    };
    insights: string[];
  } | null;
}

const MetricCard = ({ 
  icon, 
  label, 
  value, 
  change, 
  delay 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string; 
  change: string; 
  delay: number;
}) => {
  const isPositive = change.startsWith('+');
  
  return (
    <motion.div 
      className="bg-white rounded-xl p-4 border border-analyst-border shadow-sm hover:shadow-md transition-shadow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="p-2 bg-analyst-light rounded-lg">
          {icon}
        </div>
        <div className={`flex items-center text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          <span>{change}</span>
          {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        </div>
      </div>
      <h3 className="text-sm text-analyst-text">{label}</h3>
      <p className="text-2xl font-semibold mt-1">{value}</p>
    </motion.div>
  );
};

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ analysis }) => {
  if (!analysis) return null;
  
  return (
    <motion.div 
      className="w-full"
      variants={scaleAnimation}
      initial="initial"
      animate="animate"
    >
      <div className="mb-6">
        <motion.h2 
          className="text-lg font-medium mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          Business Intelligence Overview
        </motion.h2>
        <motion.p 
          className="text-sm text-analyst-text"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          Latest analysis based on your current data
        </motion.p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard 
          icon={<DollarSign size={18} className="text-green-600" />} 
          label="Revenue" 
          value={analysis.metrics.revenue} 
          change={analysis.metrics.growth} 
          delay={0.1} 
        />
        <MetricCard 
          icon={<TrendingUp size={18} className="text-blue-600" />} 
          label="Growth" 
          value={analysis.metrics.growth} 
          change="+5.2%" 
          delay={0.2} 
        />
        <MetricCard 
          icon={<Users size={18} className="text-purple-600" />} 
          label="Customers" 
          value={analysis.metrics.customers} 
          change="+12%" 
          delay={0.3} 
        />
        <MetricCard 
          icon={<PieChart size={18} className="text-red-600" />} 
          label="Churn Rate" 
          value={analysis.metrics.churn} 
          change="-0.5%" 
          delay={0.4} 
        />
      </div>
      
      <motion.div 
        className="bg-white rounded-xl p-5 border border-analyst-border mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <h3 className="font-medium mb-4">Key Insights</h3>
        <ul className="space-y-3">
          {analysis.insights.map((insight, index) => (
            <motion.li 
              key={index} 
              className="flex items-start text-sm"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.6 + (index * 0.1) }}
            >
              <div className="w-4 h-4 mt-0.5 mr-3 rounded-full bg-blue-100 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-analyst-accent"></div>
              </div>
              <span>{insight}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>
      
      <motion.div 
        className="flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.9 }}
      >
        <button className="flex items-center text-sm text-analyst-accent hover:text-blue-600 transition-colors">
          <span>View detailed analysis</span>
          <ChevronRight size={16} className="ml-1" />
        </button>
      </motion.div>
    </motion.div>
  );
};

export default AnalysisDisplay;
