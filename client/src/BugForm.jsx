import { Star } from 'lucide-react';

export default function BugForm({
  isDark,
  sessions,
  selectedSession,
  setSelectedSession,
  title,
  setTitle,
  originalError,
  setOriginalError,
  solution,
  setSolution,
  rating,
  setRating,
  loading,
  onSubmit,
}) {
  return (
    <form onSubmit={onSubmit} className={`border rounded-2xl p-5 md:p-6 space-y-4 ${
      isDark ? 'bg-[#121215] border-white/5' : 'bg-white border-gray-200 shadow-sm'
    }`}>
      <div>
        <h2 className="text-sm md:text-base font-semibold tracking-wide">Record a new error</h2>
        <p className={`text-[11px] mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Document the error and its solution to build your own dictionary.</p>
      </div>

      <div>
        <label className={`block text-[11px] mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Related Session</label>
        <select
          value={selectedSession}
          onChange={(e) => setSelectedSession(e.target.value)}
          className={`w-full border rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-blue-500 ${
            isDark ? 'bg-[#1A1A1E] border-white/5 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
          }`}
        >
          {sessions.length > 0 ? (
            sessions.map((s) => (
              <option key={s._id} value={s.title}>{s.title}</option>
            ))
          ) : (
            <option value="devpulse">devpulse</option>
          )}
        </select>
      </div>

      <div>
        <label className={`block text-[11px] mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Error Title</label>
        <input 
          type="text" 
          placeholder="Example: Mongoose Connection Refused" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className={`w-full border rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-blue-500 ${
            isDark ? 'bg-[#1A1A1E] border-white/5 text-white placeholder-gray-600' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
          }`}
        />
      </div>

      <div>
        <label className={`block text-[11px] mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Original Error Message</label>
        <textarea 
          rows={3} 
          placeholder="Paste the error text from the Terminal here..."
          value={originalError}
          onChange={(e) => setOriginalError(e.target.value)}
          className={`w-full border rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-blue-500 resize-none font-mono ${
            isDark ? 'bg-[#1A1A1E] border-white/5 text-white placeholder-gray-600' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
          }`}
        />
      </div>

      <div>
        <label className={`block text-[11px] mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Solution</label>
        <textarea 
          rows={3} 
          placeholder="How did you resolve this error?"
          value={solution}
          onChange={(e) => setSolution(e.target.value)}
          className={`w-full border rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-blue-500 resize-none ${
            isDark ? 'bg-[#1A1A1E] border-white/5 text-white placeholder-gray-600' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
          }`}
        />
      </div>

      <div>
        <label className={`block text-[11px] mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Difficulty Rating</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="p-0.5 focus:outline-none"
            >
              <Star className={`w-4 h-4 ${star <= rating ? 'fill-amber-400 text-amber-400' : (isDark ? 'text-gray-700' : 'text-gray-300')}`} />
            </button>
          ))}
        </div>
      </div>

      <button 
        type="submit"
        disabled={loading}
        className="w-full bg-[#1E88E5] hover:bg-blue-600 text-white font-medium text-xs py-3 rounded-xl transition-all shadow-md shadow-blue-500/10 disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Save Error +'}
      </button>
    </form>
  );
}