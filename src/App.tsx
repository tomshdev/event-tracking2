import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Plus, List, ArrowLeft, Trash2, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Event {
  id: string;
  timestamp: number;
}

export default function App() {
  const [events, setEvents] = useState<Event[]>([]);
  const [view, setView] = useState<'home' | 'log'>('home');
  const [showToast, setShowToast] = useState(false);

  // Load events from localStorage on mount
  useEffect(() => {
    const savedEvents = localStorage.getItem('events');
    if (savedEvents) {
      try {
        setEvents(JSON.parse(savedEvents));
      } catch (e) {
        console.error('Failed to parse events', e);
      }
    }
  }, []);

  // Save events to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  const logEvent = () => {
    const newEvent: Event = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
    };
    setEvents([newEvent, ...events]);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const clearLog = () => {
    if (window.confirm('Are you sure you want to clear all events?')) {
      setEvents([]);
    }
  };

  const lastEvent = events[0];

  return (
    <div className="min-h-screen bg-[#151619] text-white font-mono selection:bg-emerald-500/30">
      <AnimatePresence mode="wait">
        {view === 'home' ? (
          <motion.div
            key="home"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center justify-between min-h-screen p-8"
          >
            <div className="w-full max-w-md">
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <h1 className="text-xs uppercase tracking-[0.2em] text-zinc-500">System Ready</h1>
                </div>
                <div className="text-[10px] text-zinc-600 uppercase tracking-widest">v1.0.4</div>
              </div>

              <div className="text-center mb-16">
                <h2 className="text-3xl font-light tracking-tighter mb-2">EVENT TRACKER</h2>
                <p className="text-[10px] text-zinc-500 uppercase tracking-[0.3em]">One-Tap Logging</p>
              </div>
            </div>

            <div className="relative group">
              {/* Hardware-like button */}
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={logEvent}
                className="relative w-48 h-48 rounded-full bg-zinc-900 border border-zinc-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex items-center justify-center group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                <div className="absolute inset-0 border-2 border-dashed border-zinc-800/50 rounded-full scale-90 group-hover:rotate-45 transition-transform duration-700" />
                
                <div className="relative flex flex-col items-center gap-2">
                  <Plus className="w-12 h-12 text-emerald-500 group-active:scale-125 transition-transform" />
                  <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">Log Event</span>
                </div>
              </motion.button>
              
              {/* Glow effect */}
              <div className="absolute -inset-4 bg-emerald-500/5 blur-3xl rounded-full -z-10 group-hover:bg-emerald-500/10 transition-colors" />
            </div>

            <div className="w-full max-w-md flex flex-col items-center gap-8">
              <div className="text-center">
                <div className="text-[10px] text-zinc-600 uppercase tracking-widest mb-2">Last Recorded</div>
                <div className="font-mono text-lg text-zinc-300">
                  {lastEvent ? format(lastEvent.timestamp, 'HH:mm:ss') : '--:--:--'}
                </div>
                <div className="text-[10px] text-zinc-500 mt-1">
                  {lastEvent ? format(lastEvent.timestamp, 'MMM dd, yyyy') : 'No events yet'}
                </div>
              </div>

              <button
                onClick={() => setView('log')}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-900/50 border border-zinc-800 hover:bg-zinc-800 transition-colors group"
              >
                <List className="w-4 h-4 text-zinc-500 group-hover:text-emerald-500 transition-colors" />
                <span className="text-xs uppercase tracking-widest text-zinc-400">View Log</span>
              </button>
            </div>

            {/* Toast Notification */}
            <AnimatePresence>
              {showToast && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="fixed bottom-12 px-4 py-2 bg-emerald-500 text-black text-[10px] uppercase font-bold tracking-widest rounded shadow-lg"
                >
                  Event Recorded
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            key="log"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col min-h-screen"
          >
            <header className="p-6 border-b border-zinc-800 flex items-center justify-between sticky top-0 bg-[#151619]/80 backdrop-blur-md z-10">
              <button
                onClick={() => setView('home')}
                className="p-2 -ml-2 hover:bg-zinc-800 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-zinc-400" />
              </button>
              <h2 className="text-xs uppercase tracking-[0.3em] font-bold">Event Log</h2>
              <button
                onClick={clearLog}
                disabled={events.length === 0}
                className="p-2 -mr-2 hover:bg-red-500/10 rounded-full transition-colors disabled:opacity-20"
              >
                <Trash2 className="w-5 h-5 text-zinc-400 hover:text-red-500" />
              </button>
            </header>

            <main className="flex-1 p-6">
              {events.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-zinc-600 gap-4 mt-20">
                  <Clock className="w-12 h-12 opacity-20" />
                  <p className="text-[10px] uppercase tracking-widest">No events logged yet</p>
                </div>
              ) : (
                <div className="space-y-4 max-w-md mx-auto">
                  {events.map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 rounded-lg bg-zinc-900/30 border border-zinc-800/50 flex items-center justify-between group hover:border-emerald-500/30 transition-colors"
                    >
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-zinc-300">{format(event.timestamp, 'EEEE, MMM dd')}</span>
                        <span className="text-[10px] text-zinc-500 uppercase tracking-widest">
                          {format(event.timestamp, 'yyyy')}
                        </span>
                      </div>
                      <div className="text-lg font-light text-emerald-500">
                        {format(event.timestamp, 'HH:mm:ss')}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
