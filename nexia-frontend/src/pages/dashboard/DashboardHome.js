import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { dashboardApi } from '../../services/api';
import { SkeletonDashboard } from '../../components/ui/Skeleton';
import { MessageSquare, FileText, Mic, Target, TrendingUp, Award } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

  const currentMonth = new Date().getMonth(); // 0=Jan, 4=May
  const allMonths = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const mockChartData = allMonths
    .slice(Math.max(0, currentMonth - 5), currentMonth + 1)
    .map((month, i) => ({ month, score: [45, 60, 55, 72, 68, 85][i] || Math.floor(Math.random() * 40 + 50) }));

export default function DashboardHome() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardApi.get()
      .then(r => setData(r.data))
      .catch(() => setData({ totalChats: 0, resumesAnalyzed: 0, interviewsTaken: 0, avgInterviewScore: 0, activeGoals: 0, completedGoals: 0 }))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8"><SkeletonDashboard /></div>;

  const stats = [
    { icon: MessageSquare, label: 'Total Chats', value: data.totalChats, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' },
    { icon: FileText, label: 'Resumes Analyzed', value: data.resumesAnalyzed, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-500/10' },
    { icon: Mic, label: 'Interviews Taken', value: data.interviewsTaken, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-500/10' },
    { icon: Award, label: 'Avg Interview Score', value: `${data.avgInterviewScore}%`, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-500/10' },
    { icon: Target, label: 'Active Goals', value: data.activeGoals, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-500/10' },
    { icon: TrendingUp, label: 'Goals Completed', value: data.completedGoals, color: 'text-teal-500', bg: 'bg-teal-50 dark:bg-teal-500/10' },
  ];

  return (
    <div className="p-8 space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{data.recentActivity}</p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map(({ icon: Icon, label, value, color, bg }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="card"
          >
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon size={20} className={color} />
            </div>
            <div className="text-2xl font-bold">{value}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{label}</div>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="card">
        <h2 className="font-bold text-lg mb-6">Interview Score Progress</h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={mockChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="score" fill="#2563EB" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
