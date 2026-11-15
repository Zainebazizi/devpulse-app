import React, { useState, useEffect } from 'react';
import logoImg from './assets/logo.png';
import BugForm from './BugForm.jsx';
import BugList from './BugList.jsx';
import { 
  Bug, 
  LayoutDashboard, 
  Sun,
  Moon
} from 'lucide-react';

// استخدام متغير بيئة آمن لمنع ظهور undefined
const API_URL = import.meta.env.VITE_API_URL || '';

export default function BugJournal({ onNavigateToDashboard, theme, toggleTheme }) {
  const [bugs, setBugs] = useState([]);
  const [sessions, setSessions] = useState([]);

  const [selectedSession, setSelectedSession] = useState('');
  const [title, setTitle] = useState('');
  const [originalError, setOriginalError] = useState('');
  const [solution, setSolution] = useState('');
  const [rating, setRating] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const isDark = theme === 'dark';

  const fetchBugsAndSessions = async () => {
    try {
      const [bugsRes, logsRes] = await Promise.all([
        fetch(`${API_URL}/api/bugs?search=${searchQuery}`),
        fetch(`${API_URL}/api/logs`)
      ]);

      if (bugsRes.ok) {
        const bugsData = await bugsRes.json();
        setBugs(bugsData);
      }

      if (logsRes.ok) {
        const logsData = await logsRes.json();
        setSessions(logsData);
        if (logsData.length > 0) {
          setSelectedSession(logsData[0].title || '');
        }
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  useEffect(() => {
    let ignore = false;

    const timeoutId = setTimeout(async () => {
      try {
        const [bugsRes, logsRes] = await Promise.all([
          fetch(`${API_URL}/api/bugs?search=${searchQuery}`),
          fetch(`${API_URL}/api/logs`)
        ]);

        if (ignore) return;

        if (bugsRes.ok) {
          const bugsData = await bugsRes.json();
          setBugs(bugsData);
        }

        if (logsRes.ok) {
          const logsData = await logsRes.json();
          setSessions(logsData);
          if (logsData.length > 0) {
            setSelectedSession(logsData[0].title || '');
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    }, 300);

    return () => {
      ignore = true;
      clearTimeout(timeoutId);
    };
  }, [searchQuery]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/bugs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          session: selectedSession,
          originalerror: originalError, // تم مطابقتها مع اسم العمود في قاعدة البيانات
          solution,
          rating,
          priority: 'medium',
          status: 'resolved'
        })
      });

      if (res.ok) {
        setTitle('');
        setOriginalError('');
        setSolution('');
        setRating(5);
        fetchBugsAndSessions();
      }
    } catch (err) {
      console.error('Error saving bug:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/bugs/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchBugsAndSessions();
      }
    } catch (err) {
      console.error('Error deleting bug:', err);
    }
  };

  return (
    <div className={`min-h-screen font-sans px-4 sm:px-6 py-6 md:py-8 transition-colors duration-200 ${
      isDark ? 'bg-[#0A0A0C] text-white' : 'bg-gray-100 text-gray-900'
    }`}>
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Navigation / Header */}
        <header className="flex flex-col sm:flex-row justify-between items-center gap-4 pb-2">
          <div className={`flex p-1 rounded-xl border w-full sm:w-auto justify-center ${
            isDark ? 'bg-[#16161A] border-white/10' : 'bg-white border-gray-200 shadow-sm'
          }`}>
            <button 
              type="button"
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-medium bg-[#1E88E5] text-white shadow-md transition-all flex-1 sm:flex-none"
            >
              <Bug className="w-3.5 h-3.5" />
              Bug Journal
            </button>
            <button
              type="button"
              onClick={onNavigateToDashboard}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all flex-1 sm:flex-none ${
                isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Dashboard
            </button>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            {/* Theme Switcher Button */}
            <button
              onClick={toggleTheme}
              type="button"
              className={`p-2 rounded-xl border transition-all ${
                isDark ? 'bg-[#16161A] border-white/10 text-amber-400 hover:bg-white/5' : 'bg-white border-gray-200 text-slate-700 hover:bg-gray-50 shadow-sm'
              }`}
              title="Toggle Theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <div className="text-right">
              <h1 className="text-sm font-bold tracking-tight">DevPulse</h1>
              <p className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Programming diary</p>
            </div>
            {logoImg ? (
              <img src={logoImg} alt="DevPulse Logo" className="w-8 h-8 object-contain rounded-lg" />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center font-bold text-xs text-white">❖</div>
            )}
          </div>
        </header>

        <BugForm
          isDark={isDark}
          sessions={sessions}
          selectedSession={selectedSession}
          setSelectedSession={setSelectedSession}
          title={title}
          setTitle={setTitle}
          originalError={originalError}
          setOriginalError={setOriginalError}
          solution={solution}
          setSolution={setSolution}
          rating={rating}
          setRating={setRating}
          loading={loading}
          onSubmit={handleSubmit}
        />

        <BugList
          isDark={isDark}
          filteredBugs={bugs}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onDelete={handleDelete}
        />
        
      </div>
    </div>
  );
}