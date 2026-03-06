import { useState, useRef, useEffect } from 'react';
import { storyMap } from '../data/storyMap';

export default function StoryTooltip({ id, className = '' }) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState('bottom');
  const tipRef = useRef(null);
  const btnRef = useRef(null);

  const story = storyMap[id];
  if (!story) return null;

  const lane = id.split('-')[0];
  const laneColors = {
    L1: 'bg-indigo-500',
    L2: 'bg-violet-500',
    L3: 'bg-amber-500',
    L4: 'bg-teal-500',
    L5: 'bg-rose-500',
    L6: 'bg-sky-500',
    L7: 'bg-emerald-500',
    L8: 'bg-orange-500',
  };

  const laneNames = {
    L1: 'Information Architecture & Navigation',
    L2: 'Search & Smart Ranking',
    L3: 'Content Trust & Governance',
    L4: 'Market & Production Relevance',
    L5: 'Updates & Visibility',
    L6: 'Media Library Integration',
    L7: 'Integrations & Ecosystem',
    L8: 'Analytics & Insights',
  };

  useEffect(() => {
    if (open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const spaceRight = window.innerWidth - rect.right;
      if (spaceBelow < 180 && spaceAbove > spaceBelow) {
        setPosition('top');
      } else {
        setPosition('bottom');
      }
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (tipRef.current && !tipRef.current.contains(e.target) && btnRef.current && !btnRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <span className={`relative inline-flex ${className}`}>
      <button
        ref={btnRef}
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className={`${laneColors[lane] || 'bg-gray-500'} text-white text-[9px] font-bold leading-none px-1.5 py-0.5 rounded-full cursor-pointer hover:opacity-90 transition-opacity select-none whitespace-nowrap opacity-60 hover:opacity-100`}
        style={{ minWidth: '20px', textAlign: 'center' }}
      >
        {id}
      </button>
      {open && (
        <div
          ref={tipRef}
          className={`absolute z-[200] w-72 bg-easia-gray-900 text-white rounded-lg shadow-xl p-3 text-xs leading-relaxed ${
            position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
          } left-1/2 -translate-x-1/2`}
        >
          <div className={`absolute ${position === 'top' ? 'bottom-0 translate-y-1/2' : 'top-0 -translate-y-1/2'} left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-easia-gray-900 rotate-45`} />
          <div className="relative">
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`${laneColors[lane] || 'bg-gray-500'} text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full`}>{id}</span>
              <span className="text-easia-gray-300 text-[10px]">MVP</span>
            </div>
            <p className="text-[10px] text-easia-gray-300 mb-1">{laneNames[lane]}</p>
            <p className="text-white/90">{story}</p>
          </div>
        </div>
      )}
    </span>
  );
}
