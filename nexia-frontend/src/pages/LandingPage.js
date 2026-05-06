import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ThemeToggle from '../components/ui/ThemeToggle';
import {
  MessageSquare, FileText, Mic, Briefcase,
  Target, Sparkles, ArrowRight, Brain, CheckCircle
} from 'lucide-react';

const features = [
  { icon: MessageSquare, title: 'Chat with Nexia', desc: 'Get personalized career advice from your AI mentor anytime.' },
  { icon: FileText, title: 'Resume Matcher', desc: 'Upload your resume and get instant match scores with job descriptions.' },
  { icon: Mic, title: 'Mock Interview', desc: 'Practice with AI-generated role-based interview questions.' },
  { icon: Briefcase, title: 'Job Recommendations', desc: 'Discover curated job opportunities tailored to your skills.' },
  { icon: Target, title: 'Goals & Progress', desc: 'Set career goals and track your growth with visual dashboards.' },
  { icon: Sparkles, title: 'Fun Features', desc: 'AI image generator and career fortune teller for inspiration.' },
];

const stats = [
  { value: '10K+', label: 'Students Guided' },
  { value: '95%', label: 'Interview Success' },
  { value: '500+', label: 'Companies Hiring' },
  { value: '4.9★', label: 'User Rating' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <Brain size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold text-primary-600">Nexia</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link to="/login" className="btn-secondary text-sm">Login</Link>
            <Link to="/register" className="btn-primary text-sm">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-16 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="inline-block bg-primary-50 dark:bg-primary-600/20 text-primary-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            🚀 AI-Powered Career Guidance
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight mb-6">
            Your AI Career Guide<br />
            <span className="text-primary-600">Powered by Intelligence</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10">
            Nexia helps you land your dream job with AI-driven resume analysis, mock interviews, personalized coaching, and smart job recommendations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn-primary flex items-center gap-2 justify-center text-base">
              Start for Free <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn-secondary flex items-center gap-2 justify-center text-base">
              Sign In
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20"
        >
          {stats.map(({ value, label }) => (
            <div key={label} className="card text-center">
              <div className="text-3xl font-bold text-primary-600">{value}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 dark:bg-gray-800/50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Everything You Need</h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">Comprehensive tools to accelerate your career journey</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="card hover:shadow-md transition-shadow group"
              >
                <div className="w-12 h-12 bg-primary-50 dark:bg-primary-600/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-600 transition-colors">
                  <Icon size={22} className="text-primary-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-bold text-lg mb-2">{title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Career?</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
              Join thousands of professionals who've accelerated their careers with Nexia.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
              {['No credit card required', 'Free to start', 'Cancel anytime'].map(t => (
                <div key={t} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle size={16} className="text-green-500" /> {t}
                </div>
              ))}
            </div>
            <Link to="/register" className="btn-primary text-base inline-flex items-center gap-2">
              Get Started Free <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-gray-100 dark:border-gray-800 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
        © 2024 Nexia AI Career Guider. Built with ❤️ for your career success.
      </footer>
    </div>
  );
}
