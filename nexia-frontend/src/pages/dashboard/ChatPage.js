import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { chatApi } from '../../services/api';
import { Send, Bot, User, Trash2 } from 'lucide-react';
import { SkeletonList } from '../../components/ui/Skeleton';

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [sessionId] = useState(() => Date.now().toString());
  const bottomRef = useRef(null);

  useEffect(() => {
    chatApi.history()
      .then(r => setMessages(r.data.map(m => [
        { role: 'user', text: m.userMessage, id: `u${m.id}` },
        { role: 'ai', text: m.aiResponse, id: `a${m.id}` }
      ]).flat()))
      .finally(() => setHistoryLoading(false));
  }, []);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: 'user', text: input, id: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const { data } = await chatApi.send({ message: input, sessionId });
      setMessages(prev => [...prev, { role: 'ai', text: data.aiResponse, id: data.id }]);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: 'Sorry, I encountered an error. Please try again.', id: Date.now() }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Chat with Nexia</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Your AI career mentor</p>
        </div>
        <button onClick={() => setMessages([])} className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-500 transition-colors">
          <Trash2 size={16} /> Clear
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {historyLoading ? <SkeletonList count={3} /> : (
          <>
            {messages.length === 0 && (
              <div className="text-center py-16 text-gray-400">
                <Bot size={48} className="mx-auto mb-4 text-primary-300" />
                <p className="font-medium">Hi! I'm Nexia, your AI career guide.</p>
                <p className="text-sm mt-1">Ask me about careers, resumes, interviews, or skills!</p>
              </div>
            )}
            <AnimatePresence>
              {messages.map(msg => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.role === 'ai' ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}>
                    {msg.role === 'ai' ? <Bot size={16} className="text-white" /> : <User size={16} />}
                  </div>
                  <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-primary-600 text-white rounded-tr-sm'
                      : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-tl-sm'
                  }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center">
                  <Bot size={16} className="text-white" />
                </div>
                <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 px-4 py-3 rounded-2xl rounded-tl-sm">
                  <div className="flex gap-1">
                    {[0, 1, 2].map(i => (
                      <motion.div key={i} className="w-2 h-2 bg-gray-400 rounded-full"
                        animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, delay: i * 0.15, duration: 0.6 }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </>
        )}
      </div>

      <div className="flex gap-3">
        <input
          className="input flex-1"
          placeholder="Ask about careers, skills, interviews..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
        />
        <motion.button whileTap={{ scale: 0.9 }} onClick={send} disabled={loading || !input.trim()}
          className="btn-primary px-4 disabled:opacity-50">
          <Send size={18} />
        </motion.button>
      </div>
    </div>
  );
}
