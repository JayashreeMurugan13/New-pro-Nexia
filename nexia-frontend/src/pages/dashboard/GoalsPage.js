import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { goalApi } from '../../services/api';
import toast from 'react-hot-toast';
import { Target, Plus, CheckCircle } from 'lucide-react';

export default function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [form, setForm] = useState({ title: '', description: '' });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    goalApi.list().then(r => setGoals(r.data)).finally(() => setLoading(false));
  }, []);

  const createGoal = async (e) => {
    e.preventDefault();
    try {
      const { data } = await goalApi.create(form);
      setGoals(prev => [data, ...prev]);
      setForm({ title: '', description: '' });
      setShowForm(false);
      toast.success('Goal created!');
    } catch { toast.error('Failed to create goal'); }
  };

  const updateProgress = async (id, progress) => {
    try {
      const { data } = await goalApi.updateProgress(id, progress);
      setGoals(prev => prev.map(g => g.id === id ? data : g));
    } catch { toast.error('Update failed'); }
  };

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Goals & Progress</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Track your career milestones</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> New Goal
        </button>
      </div>

      {showForm && (
        <motion.form initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          onSubmit={createGoal} className="card mb-6 space-y-4">
          <input className="input" placeholder="Goal title" required value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })} />
          <textarea className="input resize-none h-20 text-sm" placeholder="Description (optional)"
            value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          <div className="flex gap-3">
            <button type="submit" className="btn-primary">Create Goal</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
          </div>
        </motion.form>
      )}

      {loading ? (
        <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="skeleton h-24 rounded-2xl" />)}</div>
      ) : goals.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Target size={48} className="mx-auto mb-4" />
          <p>No goals yet. Create your first career goal!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {goals.map((goal, i) => (
            <motion.div key={goal.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="card">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{goal.title}</h3>
                    {goal.status === 'COMPLETED' && <CheckCircle size={16} className="text-green-500" />}
                  </div>
                  {goal.description && <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{goal.description}</p>}
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  goal.status === 'COMPLETED' ? 'bg-green-50 dark:bg-green-500/10 text-green-600' :
                  'bg-blue-50 dark:bg-blue-500/10 text-blue-600'
                }`}>{goal.status}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }} animate={{ width: `${goal.progress}%` }}
                    className="bg-primary-600 h-2 rounded-full transition-all"
                  />
                </div>
                <span className="text-sm font-medium w-10 text-right">{goal.progress}%</span>
              </div>
              {goal.status !== 'COMPLETED' && (
                <input type="range" min="0" max="100" value={goal.progress}
                  onChange={e => updateProgress(goal.id, parseInt(e.target.value))}
                  className="w-full mt-2 accent-primary-600" />
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
