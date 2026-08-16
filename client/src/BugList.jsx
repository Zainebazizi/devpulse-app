
import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, Star } from 'lucide-react';

export default function BugList({isDark, filteredBugs, searchQuery, setSearchQuery, onDelete}) {
const [expandedError,setExpandedError]=useState(null);

  return (
     <div className="space-y-4">
          <h2 className="text-sm md:text-base font-semibold tracking-wide">Error Dictionary</h2>

          <div className="relative">
            <Search className={`w-4 h-4 absolute left-3.5 top-3 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
            <input 
              type="text" 
              placeholder='Search for errors... (Example: "React")' 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full border rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-blue-500 ${
                isDark ? 'bg-[#121215] border-white/5 text-white placeholder-gray-500' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 shadow-sm'
              }`}
            />
          </div>

          {filteredBugs.length === 0 ? (
            <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>No errors recorded yet.</p>
          ) : (
            filteredBugs.map((bug) => {
              const isExpanded = expandedError === bug._id;
              const bugRating = bug.rating || 5;

              return (
                <div key={bug._id} className={`border rounded-2xl p-4 transition-all ${
                  isDark ? 'bg-[#121215] border-white/5' : 'bg-white border-gray-200 shadow-sm'
                }`}>
                  <div 
                    className="flex justify-between items-start cursor-pointer" 
                    onClick={() => setExpandedError(isExpanded ? null : bug._id)}
                  >
                    <div className="space-y-1">
                      <h3 className="text-xs font-semibold">{bug.title}</h3>
                      <div className="flex items-center gap-2">
                        <span className={`text-[11px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{bug.session || 'DevPulse App'}</span>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              className={`w-3 h-3 ${star <= bugRating ? 'fill-amber-400 text-amber-400' : (isDark ? 'text-gray-700' : 'text-gray-300')}`} 
                            />
                            
                          ))}
                        </div>
                      </div>
                 </div>

                    <div className="flex items-center gap-3">
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                     <button
    onClick={(e) => {
      e.stopPropagation();
      onDelete(bug._id);
    }}
    className="bg-red-500 hover:bg-red-600 active:bg-red-700 text-white text-xs font-medium px-2.5 py-1 rounded transition-colors"
  >
    Delete
  </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className={`mt-4 pt-3 border-t space-y-3 ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
                      <div>
                        <span className={`block text-[11px] mb-1 font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Error Message</span>
                        <div className={`p-3 rounded-xl text-xs font-mono border ${
                          isDark ? 'bg-[#1A1A1E] text-rose-400 border-white/5' : 'bg-rose-50 text-rose-700 border-rose-100'
                        }`}>
                          {bug.originalError || bug.description?.split('|')[0] || 'No raw error message.'}
                        </div>
                      </div>

                      <div>
                        <span className={`block text-[11px] mb-1 font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Solution</span>
                        <div className={`p-3 rounded-xl text-xs leading-relaxed border ${
                          isDark ? 'bg-[#1A1A1E] text-gray-300 border-white/5' : 'bg-gray-50 text-gray-700 border-gray-200'
                        }`}>
                          {bug.solution || bug.description?.split('|')[1] || bug.description || 'No solution provided.'}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

  );
}