import { useState } from 'react';
import { motion } from 'framer-motion';
import { resumeApi } from '../../services/api';
import toast from 'react-hot-toast';
import { Upload, CheckCircle, XCircle, FileText, Lightbulb } from 'lucide-react';

export default function ResumePage() {
  const [file, setFile] = useState(null);
  const [jd, setJd] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!file || !jd.trim()) { toast.error('Please upload a resume and enter a job description'); return; }
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('jobDescription', jd);
    try {
      const { data } = await resumeApi.analyze(formData);
      setResult(data);
      toast.success('Resume analyzed by AI successfully!');
    } catch {
      toast.error('Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const matchColor = result
    ? result.matchPercentage >= 70 ? 'text-green-500' : result.matchPercentage >= 40 ? 'text-yellow-500' : 'text-red-500'
    : '';

  const barColor = result
    ? result.matchPercentage >= 70 ? 'bg-green-500' : result.matchPercentage >= 40 ? 'bg-yellow-500' : 'bg-red-500'
    : '';

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-2">Resume Matcher</h1>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
        AI-powered resume analysis using Groq LLaMA 3.1
      </p>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="card">
          <h2 className="font-semibold mb-4 flex items-center gap-2"><FileText size={18} /> Upload Resume</h2>
          <label className="border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-xl p-8 flex flex-col items-center cursor-pointer hover:border-blue-400 transition-colors">
            <Upload size={32} className="text-gray-400 mb-3" />
            <span className="text-sm text-gray-500 text-center">
              {file ? `✅ ${file.name}` : 'Click to upload resume (.txt, .pdf)'}
            </span>
            <input type="file" accept=".txt,.pdf" className="hidden" onChange={e => setFile(e.target.files[0])} />
          </label>
        </div>

        <div className="card">
          <h2 className="font-semibold mb-4">Job Description</h2>
          <textarea
            className="input resize-none h-40 text-sm"
            placeholder="Paste the job description here..."
            value={jd}
            onChange={e => setJd(e.target.value)}
          />
        </div>
      </div>

      <button onClick={handleAnalyze} disabled={loading} className="btn-primary flex items-center gap-2">
        {loading ? (
          <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Analyzing with AI...</>
        ) : 'Analyze with Groq AI'}
      </button>

      {result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8 space-y-4">
          {/* Score */}
          <div className="card text-center">
            <div className={`text-6xl font-extrabold ${matchColor}`}>{result.matchPercentage}%</div>
            <div className="text-gray-500 dark:text-gray-400 mt-2 font-medium">AI Match Score</div>
            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3 mt-4">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${result.matchPercentage}%` }}
                transition={{ duration: 1.2 }}
                className={`h-3 rounded-full ${barColor}`}
              />
            </div>
            <p className="text-sm mt-3 text-gray-500">
              {result.matchPercentage >= 70 ? '🎉 Strong match! You are a great fit for this role.' :
               result.matchPercentage >= 40 ? '⚡ Moderate match. Work on the missing skills below.' :
               '📚 Low match. Significant skill gaps to address.'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Matched Skills */}
            <div className="card">
              <h3 className="font-semibold mb-3 flex items-center gap-2 text-green-600">
                <CheckCircle size={16} /> Matched Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.extractedSkills?.split(', ').filter(Boolean).map(s => (
                  <span key={s} className="bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 text-xs px-3 py-1 rounded-full font-medium">{s}</span>
                ))}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="card">
              <h3 className="font-semibold mb-3 flex items-center gap-2 text-red-500">
                <XCircle size={16} /> Missing Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.missingSkills?.split(', ').filter(Boolean).map(s => (
                  <span key={s} className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-xs px-3 py-1 rounded-full font-medium">{s}</span>
                ))}
              </div>
            </div>
          </div>

          {/* AI Suggestions */}
          {result.suggestions && (
            <div className="card">
              <h3 className="font-semibold mb-3 flex items-center gap-2 text-blue-600">
                <Lightbulb size={16} /> AI Suggestions
              </h3>
              <ul className="space-y-2">
                {result.suggestions.split(' | ').filter(Boolean).map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <span className="text-blue-500 font-bold mt-0.5">→</span> {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
