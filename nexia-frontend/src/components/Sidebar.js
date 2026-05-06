import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ui/ThemeToggle';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, MessageSquare, FileText, Video,
  Mic, Briefcase, Target, Sparkles, LogOut, Brain
} from 'lucide-react';

const links = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/dashboard/chat', icon: MessageSquare, label: 'Chat with Nexia' },
  { to: '/dashboard/resume', icon: FileText, label: 'Resume Matcher' },
  { to: '/dashboard/interview-coach', icon: Video, label: 'Interview Coach' },
  { to: '/dashboard/mock-interview', icon: Mic, label: 'Mock Interview' },
  { to: '/dashboard/jobs', icon: Briefcase, label: 'Job Recommendations' },
  { to: '/dashboard/goals', icon: Target, label: 'Goals & Progress' },
  { to: '/dashboard/fun', icon: Sparkles, label: 'Fun Features' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-64 min-h-screen bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex flex-col"
    >
      <div className="p-6 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <Brain size={18} className="text-white" />
          </div>
          <span className="text-xl font-bold text-primary-600">Nexia</span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">AI Career Guider</p>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/dashboard'}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <Icon size={18} />
            <span className="text-sm">{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100 dark:border-gray-800 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold truncate">{user?.fullName}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
          </div>
          <ThemeToggle />
        </div>
        <button onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 transition-colors w-full">
          <LogOut size={16} /> Logout
        </button>
      </div>
    </motion.aside>
  );
}
