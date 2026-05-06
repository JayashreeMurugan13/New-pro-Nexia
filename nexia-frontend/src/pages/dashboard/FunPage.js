import { useState } from 'react';
import { motion } from 'framer-motion';
import { Image, Star } from 'lucide-react';

const FORTUNES = [
  "🌟 Your next career move will open doors you never imagined. A leadership role awaits!",
  "💡 Your unique skills will be recognized soon. Keep building and stay consistent.",
  "🚀 A breakthrough opportunity is approaching. Be ready to say YES!",
  "🎯 Focus on one skill this month — it will become your superpower.",
  "🌈 Collaboration will be your key to success. Reach out to that mentor today.",
  "⚡ Your persistence is about to pay off. The interview you've been waiting for is near.",
];

const AI_IMAGES = [
  { prompt: 'Software Engineer', emoji: '👨‍💻', desc: 'A focused developer building the future' },
  { prompt: 'Data Scientist', emoji: '📊', desc: 'Turning data into powerful insights' },
  { prompt: 'Product Manager', emoji: '🎯', desc: 'Visionary leader driving product success' },
  { prompt: 'DevOps Engineer', emoji: '⚙️', desc: 'Automating the path to deployment' },
];

export default function FunPage() {
  const [fortune, setFortune] = useState(null);
  const [revealing, setRevealing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const revealFortune = () => {
    setRevealing(true);
    setFortune(null);
    setTimeout(() => {
      setFortune(FORTUNES[Math.floor(Math.random() * FORTUNES.length)]);
      setRevealing(false);
    }, 1500);
  };

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-2">Fun Features</h1>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">A little fun to fuel your career journey ✨</p>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Fortune Teller */}
        <div className="card text-center">
          <div className="text-5xl mb-4">🔮</div>
          <h2 className="text-xl font-bold mb-2">Career Fortune Teller</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Discover what the AI stars say about your career</p>

          <button onClick={revealFortune} disabled={revealing}
            className="btn-primary flex items-center gap-2 mx-auto">
            <Star size={16} /> {revealing ? 'Reading your future...' : 'Reveal My Fortune'}
          </button>

          {revealing && (
            <div className="mt-6 flex justify-center">
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}
                className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full" />
            </div>
          )}

          {fortune && (
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
              className="mt-6 bg-gradient-to-br from-primary-50 to-blue-50 dark:from-primary-600/10 dark:to-blue-600/10 rounded-2xl p-5 text-sm font-medium text-gray-700 dark:text-gray-300 leading-relaxed">
              {fortune}
            </motion.div>
          )}
        </div>

        {/* AI Image Generator */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Image size={20} className="text-primary-600" />
            <h2 className="text-xl font-bold">AI Career Visualizer</h2>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Visualize yourself in your dream role</p>

          <div className="grid grid-cols-2 gap-3">
            {AI_IMAGES.map(img => (
              <motion.button key={img.prompt} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedImage(img)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  selectedImage?.prompt === img.prompt
                    ? 'border-primary-600 bg-primary-50 dark:bg-primary-600/10'
                    : 'border-gray-200 dark:border-gray-600 hover:border-primary-300'
                }`}>
                <div className="text-3xl mb-2">{img.emoji}</div>
                <div className="text-sm font-semibold">{img.prompt}</div>
              </motion.button>
            ))}
          </div>

          {selectedImage && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="mt-4 bg-gradient-to-br from-primary-600 to-blue-700 rounded-2xl p-6 text-white text-center">
              <div className="text-6xl mb-3">{selectedImage.emoji}</div>
              <div className="font-bold text-lg">{selectedImage.prompt}</div>
              <div className="text-sm text-blue-100 mt-1">{selectedImage.desc}</div>
              <div className="mt-3 text-xs text-blue-200">✨ AI-generated career visualization</div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
