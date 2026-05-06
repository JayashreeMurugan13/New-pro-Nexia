import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { interviewApi } from '../../services/api';
import toast from 'react-hot-toast';
import { Mic, ChevronRight, Award, RotateCcw } from 'lucide-react';

const ROLES = ['Software Engineer', 'Data Scientist', 'Product Manager', 'DevOps Engineer', 'UI/UX Designer'];

export default function MockInterviewPage() {
  const [step, setStep] = useState('setup'); // setup | interview | result
  const [role, setRole] = useState('Software Engineer');
  const [interview, setInterview] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [current, setCurrent] = useState(0);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const startInterview = async () => {
    setLoading(true);
    try {
      const { data } = await interviewApi.start({ role, questionCount: 5 });
      setInterview(data);
      setAnswers(new Array(data.questions.length).fill(''));
      setStep('interview');
      setCurrent(0);
    } catch { toast.error('Failed to start interview'); }
    finally { setLoading(false); }
  };

  const submitInterview = async () => {
    setLoading(true);
    try {
      const { data } = await interviewApi.submit({ interviewId: interview.id, answers });
      setResult(data);
      setStep('result');
    } catch { toast.error('Submission failed'); }
    finally { setLoading(false); }
  };

  const reset = () => { setStep('setup'); setInterview(null); setResult(null); setAnswers([]); };

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-2">Mock Interview</h1>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">Practice with AI-generated role-based questions</p>

      <AnimatePresence mode="wait">
        {step === 'setup' && (
          <motion.div key="setup" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="card space-y-6">
            <div>
              <label className="block text-sm font-medium mb-3">Select Role</label>
              <div className="grid grid-cols-2 gap-3">
                {ROLES.map(r => (
                  <button key={r} onClick={() => setRole(r)}
                    className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                      role === r ? 'border-primary-600 bg-primary-50 dark:bg-primary-600/10 text-primary-600' : 'border-gray-200 dark:border-gray-600 hover:border-primary-300'
                    }`}>
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={startInterview} disabled={loading} className="btn-primary flex items-center gap-2">
              <Mic size={18} /> {loading ? 'Starting...' : 'Start Interview'}
            </button>
          </motion.div>
        )}

        {step === 'interview' && interview && (
          <motion.div key="interview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Question {current + 1} of {interview.questions.length}</span>
              <div className="w-32 bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-primary-600 h-2 rounded-full transition-all" style={{ width: `${((current + 1) / interview.questions.length) * 100}%` }} />
              </div>
            </div>

            <div className="card">
              <p className="font-semibold text-lg mb-4">{interview.questions[current]}</p>
              <textarea
                className="input resize-none h-32 text-sm"
                placeholder="Type your answer here..."
                value={answers[current]}
                onChange={e => { const a = [...answers]; a[current] = e.target.value; setAnswers(a); }}
              />
            </div>

            <div className="flex gap-3">
              {current > 0 && <button onClick={() => setCurrent(c => c - 1)} className="btn-secondary">Back</button>}
              {current < interview.questions.length - 1
                ? <button onClick={() => setCurrent(c => c + 1)} className="btn-primary flex items-center gap-2">Next <ChevronRight size={16} /></button>
                : <button onClick={submitInterview} disabled={loading} className="btn-primary">
                    {loading ? 'Submitting...' : 'Submit Interview'}
                  </button>
              }
            </div>
          </motion.div>
        )}

        {step === 'result' && result && (
          <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
            <div className="card text-center">
              <Award size={48} className="mx-auto text-primary-600 mb-4" />
              <div className="text-5xl font-extrabold text-primary-600">{result.score}%</div>
              <div className="text-gray-500 dark:text-gray-400 mt-2">Your Score</div>
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 rounded-xl p-4">{result.feedback}</p>
            </div>
            <button onClick={reset} className="btn-secondary flex items-center gap-2"><RotateCcw size={16} /> Try Again</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
