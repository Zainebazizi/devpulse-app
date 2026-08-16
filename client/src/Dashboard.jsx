import React, { useState, useEffect } from 'react';
import logoImg from './assets/logo.png';
import { 
  Bug, 
  LayoutDashboard, 
  Clock, 
  Folder, 
  Calendar,
  Sun,
  Moon
} from 'lucide-react';

export default function Dashboard({ onNavigateToJournal, theme, toggleTheme }) {
  const [logs, setLogs] = useState([]);
  const [bugs, setBugs] = useState([]);
  const [hours, setHours] = useState('');
  const [section, setSection] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isDark = theme === 'dark';

  const fetchDashboardData = async () => {
    try {
      const [logsRes, bugsRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/logs`),
        fetch(`${import.meta.env.VITE_API_URL}/bugs`)
      ]);

      if (logsRes.ok) setLogs(await logsRes.json());
      if (bugsRes.ok) setBugs(await bugsRes.json());
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Could not load dashboard data.');
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);
  const handleDelete = async (id) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/logs/${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      fetchDashboardData();   
    }
  } catch (err) {
    console.error('Error deleting log:', err);
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!projectTitle || !summary) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: projectTitle,
          level: section || 'Backend',
          message: summary,
          hours: hours ? parseFloat(hours) : 0
        })
      });

      if (res.ok) {
        setHours('');
        setSection('');
        setProjectTitle('');
        setSummary('');
        fetchDashboardData();
      } else {
        setError('Failed to save session.');
      }
    } catch (err) {
      console.error('Error saving session:', err);
      setError('Failed to save session.');
    } finally {
      setLoading(false);
    }
  };


  const getBadgeStyle = (level = '') => {
    const l = level.toLowerCase();
    if (l.includes('backend')) return isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700';
    if (l.includes('frontend')) return isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700';
    if (l.includes('database')) return isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-700';
    if (l.includes('testing')) return isDark ? 'bg-rose-500/20 text-rose-400' : 'bg-rose-100 text-rose-700';
    return isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700';
  };

  const resolvedBugsCount = bugs.filter((b) => b.status === 'resolved').length;
  const totalHours = logs.reduce((sum, log) => sum + (log.hours || 0), 0);
  const uniqueProjects = new Set(logs.map((log) => log.title)).size;
  const uniqueActivityDays = new Set(
    logs.map((log) => new Date(log.createdAt || Date.now()).toDateString())
  ).size;

  return (
    <div className={`min-h-screen font-sans px-4 sm:px-6 py-6 md:py-8 transition-colors duration-200 ${
      isDark ? 'bg-[#0A0A0C] text-white' : 'bg-gray-100 text-gray-900'
    }`}>
      <div className="max-w-4xl mx-auto space-y-6">

        <header className="flex flex-col sm:flex-row justify-between items-center gap-4 pb-2">
          <div className={`flex p-1 rounded-xl border w-full sm:w-auto justify-center ${
            isDark ? 'bg-[#16161A] border-white/10' : 'bg-white border-gray-200 shadow-sm'
          }`}>
            <button
              type="button"
              onClick={onNavigateToJournal}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all flex-1 sm:flex-none ${
                isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Bug className="w-3.5 h-3.5" />
              Bug Journal
            </button>
            <button 
              type="button"
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-medium bg-[#1E88E5] text-white shadow-md transition-all flex-1 sm:flex-none"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Dashboard
            </button>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
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

        {error && (
          <div className={`text-xs px-4 py-2 rounded-xl border ${
            isDark ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' : 'bg-rose-50 border-rose-200 text-rose-700'
          }`}>
            {error}
          </div>
        )}

  
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div className={`border p-4 md:p-5 rounded-2xl space-y-3 ${
            isDark ? 'bg-[#121215] border-white/5' : 'bg-white border-gray-200 shadow-sm'
          }`}>
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-500 flex items-center justify-center">
              <Bug className="w-4 h-4" />
            </div>
            <div className={`p-3 md:p-4 rounded-xl ${isDark ? 'bg-[#1A1A1E]' : 'bg-gray-50'}`}>
              <div className="text-2xl font-bold">{resolvedBugsCount}</div>
              <div className={`text-[11px] mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Errors that were resolved</div>
            </div>
          </div>

          <div className={`border p-4 md:p-5 rounded-2xl space-y-3 ${
            isDark ? 'bg-[#121215] border-white/5' : 'bg-white border-gray-200 shadow-sm'
          }`}>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div className={`p-3 md:p-4 rounded-xl ${isDark ? 'bg-[#1A1A1E]' : 'bg-gray-50'}`}>
              <div className="text-2xl font-bold">{totalHours} HOURS</div>
              <div className={`text-[11px] mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Total hours logged</div>
            </div>
          </div>

          <div className={`border p-4 md:p-5 rounded-2xl space-y-3 ${
            isDark ? 'bg-[#121215] border-white/5' : 'bg-white border-gray-200 shadow-sm'
          }`}>
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-500 flex items-center justify-center">
              <Folder className="w-4 h-4" />
            </div>
            <div className={`p-3 md:p-4 rounded-xl ${isDark ? 'bg-[#1A1A1E]' : 'bg-gray-50'}`}>
              <div className="text-2xl font-bold">{uniqueProjects}</div>
              <div className={`text-[11px] mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Number of projects</div>
            </div>
          </div>

          <div className={`border p-4 md:p-5 rounded-2xl space-y-3 ${
            isDark ? 'bg-[#121215] border-white/5' : 'bg-white border-gray-200 shadow-sm'
          }`}>
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-500 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div className={`p-3 md:p-4 rounded-xl ${isDark ? 'bg-[#1A1A1E]' : 'bg-gray-50'}`}>
              <div className="text-2xl font-bold">{uniqueActivityDays}</div>
              <div className={`text-[11px] mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Activity days</div>
            </div>
          </div>

        </div>


        <form onSubmit={handleSubmit} className={`border rounded-2xl p-5 md:p-6 space-y-4 ${
          isDark ? 'bg-[#121215] border-white/5' : 'bg-white border-gray-200 shadow-sm'
        }`}>
          <div>
            <h2 className="text-sm md:text-base font-semibold tracking-wide">Record a new programming session</h2>
            <p className={`text-[11px] mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Record what you accomplished today before you forget it.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            <div>
              <label className={`block text-[11px] mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Number of programming hours</label>
              <input 
                type="number" 
                step="0.5"
                placeholder="2.5" 
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className={`w-full border rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-blue-500 ${
                  isDark ? 'bg-[#1A1A1E] border-white/5 text-white placeholder-gray-600' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                }`}
              />
            </div>
            <div>
              <label className={`block text-[11px] mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Section</label>
              <input 
                type="text" 
                placeholder="Backend / Frontend" 
                value={section}
                onChange={(e) => setSection(e.target.value)}
                className={`w-full border rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-blue-500 ${
                  isDark ? 'bg-[#1A1A1E] border-white/5 text-white placeholder-gray-600' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                }`}
              />
            </div>
          </div>

          <div>
            <label className={`block text-[11px] mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Project Title</label>
            <input 
              type="text" 
              placeholder="DevPulse App" 
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              required
              className={`w-full border rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-blue-500 ${
                isDark ? 'bg-[#1A1A1E] border-white/5 text-white placeholder-gray-600' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
              }`}
            />
          </div>

          <div>
            <label className={`block text-[11px] mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Summary of what I accomplished today</label>
            <textarea 
              rows={3} 
              placeholder="Built feature components and fixed CSS bugs..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              required
              className={`w-full border rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-blue-500 resize-none ${
                isDark ? 'bg-[#1A1A1E] border-white/5 text-white placeholder-gray-600' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
              }`}
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#1E88E5] hover:bg-blue-600 text-white font-medium text-xs py-3 rounded-xl transition-all shadow-md shadow-blue-500/10 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Session saving +'}
          </button>
        </form>

        <div className={`border rounded-2xl p-5 md:p-6 space-y-4 ${
          isDark ? 'bg-[#121215] border-white/5' : 'bg-white border-gray-200 shadow-sm'
        }`}>
          <h2 className="text-sm md:text-base font-semibold tracking-wide">Timetable</h2>

          <div className="space-y-4">
            {logs.length === 0 ? (
              <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>No sessions recorded yet.</p>
            ) : (
              logs.map((log) => (
                <div key={log._id} className={`border-b pb-3 space-y-1.5 last:border-none last:pb-0 ${
                  isDark ? 'border-white/5' : 'border-gray-100'
                }`}>
  <div className="flex items-center justify-between">
  <div className="flex items-center gap-2">
    <span className="font-semibold text-xs">{log.title}</span>
    <span className={`text-[10px] px-2 py-0.5 rounded-md font-medium ${getBadgeStyle(log.level)}`}>
      {log.level || 'General'}
    </span>
  </div>
  <button 
    onClick={() => handleDelete(log._id)} 
    className="bg-red-500 hover:bg-red-600 text-white text-xs px-2.5 py-1 rounded transition-colors"
  >
    Delete
  </button>
</div>

                  <div className={`text-[11px] flex items-center gap-1.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    <span>
                      {new Date(log.createdAt || Date.now()).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                    <span className={`w-1 h-1 rounded-full inline-block ${isDark ? 'bg-gray-500' : 'bg-gray-400'}`}></span>
                    <span>{log.hours ?? 0} hours</span>
                  </div>

                  <p className={`text-xs leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{log.message}</p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}