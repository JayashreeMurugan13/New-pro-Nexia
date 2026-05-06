import { useState } from 'react';
import { motion } from 'framer-motion';
import { Video, Upload, CheckCircle } from 'lucide-react';

const TIPS = [
  'Maintain eye contact with the camera',
  'Speak clearly and at a moderate pace',
  'Use the STAR method for behavioral questions',
  'Dress professionally even for virtual interviews',
  'Minimize background distractions',
  'Prepare questions to ask the interviewer',
];

export default function InterviewCoachPage() {
  const [uploaded, setUploaded] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = (e) => {
    if (e.target.files[0]) {
      setUploaded(true);
      setLoading(true);
      setTimeout(() => {
        setFeedback({
          overallScore: 78,
          communication: 82,
          confidence: 74,
          clarity: 80,
          suggestions: [
            'Great eye contact and professional appearance.',
            'Try to reduce filler words like "um" and "uh".',
            'Your answers were well-structured using the STAR method.',
            'Consider slowing down slightly when explaining technical concepts.',
          ]
        });
        setLoading(false);
      }, 2500);
    }
  };

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-2">Interview Coach</h1>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">Upload your practice interview video for AI feedback</p>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="card">
            <h2 className="font-semibold mb-4 flex items-center gap-2"><Video size={18} /> Upload Video</h2>
            <label className="border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-xl p-8 flex flex-col items-center cursor-pointer hover:border-primary-400 transition-colors">
              <Upload size={32} className="text-gray-400 mb-3" />
              <span className="text-sm text-gray-500">{uploaded ? '✅ Video uploaded' : 'Click to upload video'}</span>
              <input type="file" accept="video/*" className="hidden" onChange={handleUpload} />
            </label>
          </div>

          <div className="card">
            <h2 className="font-semibold mb-4">Interview Tips</h2>
            <ul className="space-y-2">
              {TIPS.map(tip => (
                <li key={tip} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" /> {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          {loading && (
            <div className="card text-center py-12">
              <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-500">Analyzing your interview...</p>
            </div>
          )}
          {feedback && !loading && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="card text-center">
                <div className="text-5xl font-extrabold text-primary-600">{feedback.overallScore}%</div>
                <div className="text-gray-500 dark:text-gray-400 mt-1">Overall Score</div>
              </div>
              <div className="card space-y-4">
                {[
                  { label: 'Communication', value: feedback.communication },
                  { label: 'Confidence', value: feedback.confidence },
                  { label: 'Clarity', value: feedback.clarity },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{label}</span>
                      <span className="text-gray-500">{value}%</span>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }}
                        className="bg-primary-600 h-2 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="card">
                <h3 className="font-semibold mb-3">AI Feedback</h3>
                <ul className="space-y-2">
                  {feedback.suggestions.map(s => (
                    <li key={s} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <CheckCircle size={14} className="text-primary-500 mt-0.5 flex-shrink-0" /> {s}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
