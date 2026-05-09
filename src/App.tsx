/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  ChevronLeft, 
  BarChart3, 
  Calendar as CalendarIcon, 
  Droplets, 
  Wind, 
  Book, 
  Activity, 
  Check, 
  RotateCcw,
  LayoutGrid,
  TrendingUp,
  Award,
  Settings2,
  Trash2,
  X,
  Smartphone,
  ChevronRight,
  Flame,
  Minus,
  Sparkles,
  Dumbbell,
  Bike,
  Waves,
  Trophy,
  Timer,
  Bell,
  BellRing,
  Clock,
  CalendarDays,
  Pencil,
  Footprints,
  Target,
  HeartPulse,
  MonitorPlay,
  Tent,
  Pill,
  Hospital,
  Stethoscope,
  Heart,
  Flower,
  Brain,
  Smile,
  Moon,
  Sun,
  Coffee,
  Gamepad2,
  Music,
  Camera,
  Apple,
  Zap,
  Laptop,
  Headset,
  Mic2,
  Lightbulb,
  PenTool,
  Rocket,
  Leaf,
  Dog,
  Gamepad,
  Dices,
  Coins,
  Wallet,
  Code2,
  Database,
  Cpu,
  Trees,
  Infinity,
  Star,
  Wine,
  Cloud,
  Car,
  Train,
  Plane,
  ShoppingCart,
  Languages,
  Utensils,
  GlassWater,
  CigaretteOff,
  Skull
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Habit, HabitType } from './types';
import { INITIAL_HABITS, getTodayDate, getDayName, formatDate, calculateStreak } from './lib/utils';

// Lucide icon mapping
const ICON_MAP: Record<string, any> = {
  Droplets,
  Wind,
  Book,
  Activity,
  Award,
  TrendingUp,
  Sparkles,
  Dumbbell,
  Bike,
  Waves,
  Trophy,
  Timer,
  Footprints,
  Target,
  HeartPulse,
  MonitorPlay,
  Tent,
  Pill,
  Hospital,
  Stethoscope,
  Heart,
  Flower,
  Brain,
  Smile,
  Moon,
  Sun,
  Coffee,
  Gamepad2,
  Music,
  Camera,
  Apple,
  Zap,
  Laptop,
  Headset,
  Mic2,
  Lightbulb,
  PenTool,
  Rocket,
  Leaf,
  Dog,
  Gamepad,
  Dices,
  Coins,
  Wallet,
  Code2,
  Database,
  Cpu,
  Trees,
  Infinity,
  Star,
  Wine,
  Cloud,
  Car,
  Train,
  Plane,
  ShoppingCart,
  Languages,
  Utensils,
  GlassWater,
  CigaretteOff,
  Skull
};

export default function App() {
  const [userName, setUserName] = useState<string | null>(() => {
    return localStorage.getItem('minima_user_name');
  });
  
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(() => {
    return localStorage.getItem('minima_onboarding_done') === 'true';
  });

  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('minima_habits');
    return saved ? JSON.parse(saved) : INITIAL_HABITS;
  });

  const [currentView, setCurrentView] = useState<'OVERVIEW' | 'DETAIL' | 'ANALYTICS' | 'CREATE' | 'EDIT'>('OVERVIEW');
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('minima_habits', JSON.stringify(habits));
  }, [habits]);

  const handleFinishOnboarding = (name: string) => {
    setUserName(name);
    localStorage.setItem('minima_user_name', name);
    localStorage.setItem('minima_onboarding_done', 'true');
    setHasCompletedOnboarding(true);
  };

  const selectedHabit = useMemo(() => 
    habits.find(h => h.id === selectedHabitId) || null,
    [habits, selectedHabitId]
  );

  const today = getTodayDate();

  // Handlers
  const handleToggleHabit = (id: string) => {
    setHabits(prev => prev.map(h => {
      if (h.id === id && h.type === 'boolean') {
        const currentVal = h.history[today] || 0;
        return {
          ...h,
          history: { ...h.history, [today]: currentVal === 1 ? 0 : 1 }
        };
      }
      return h;
    }));
  };

  const handleUpdateNumeric = (id: string, amount: number) => {
    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        const currentVal = h.history[today] || 0;
        return {
          ...h,
          history: { ...h.history, [today]: Math.max(0, currentVal + amount) }
        };
      }
      return h;
    }));
  };

  const handleSetNumeric = (id: string, value: number) => {
    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        return {
          ...h,
          history: { ...h.history, [today]: Math.max(0, value) }
        };
      }
      return h;
    }));
  };

  const handleAddHabit = (newHabit: Habit) => {
    setHabits(prev => [...prev, newHabit]);
    setCurrentView('OVERVIEW');
  };

  const handleUpdateHabitSettings = (updated: Habit) => {
    setHabits(prev => prev.map(h => h.id === updated.id ? updated : h));
    setCurrentView('OVERVIEW');
  };

  const handleDeleteHabit = (id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
    setCurrentView('OVERVIEW');
    setSelectedHabitId(null);
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-bg-main relative overflow-hidden font-sans border-x-8 border-brand-dark shadow-2xl">
      <AnimatePresence mode="wait">
        {!hasCompletedOnboarding ? (
          <Onboarding key="onboarding" onFinish={handleFinishOnboarding} />
        ) : (
          <>
            {currentView === 'OVERVIEW' && (
              <Dashboard 
                key="dashboard"
                userName={userName || ''}
                habits={habits}
                onSelectHabit={(id) => {
                  setSelectedHabitId(id);
                  setCurrentView('DETAIL');
                }}
                onToggleBoolean={handleToggleHabit}
                onUpdateNumeric={handleUpdateNumeric}
                onCreateNew={() => setCurrentView('CREATE')}
                onViewAnalytics={() => setCurrentView('ANALYTICS')}
              />
            )}

            {currentView === 'DETAIL' && selectedHabit && (
              <HabitDetail 
                key="detail"
                habit={selectedHabit}
                onBack={() => setCurrentView('OVERVIEW')}
                onUpdateNumeric={handleUpdateNumeric}
                onSetNumeric={handleSetNumeric}
                onDelete={handleDeleteHabit}
                onEdit={() => setCurrentView('EDIT')}
              />
            )}

            {currentView === 'EDIT' && selectedHabit && (
              <CreateHabit 
                key="edit"
                initialHabit={selectedHabit}
                onBack={() => setCurrentView('DETAIL')}
                onSave={handleUpdateHabitSettings}
              />
            )}

            {currentView === 'ANALYTICS' && (
              <Analytics 
                key="analytics"
                habits={habits}
                onBack={() => setCurrentView('OVERVIEW')}
              />
            )}

            {currentView === 'CREATE' && (
              <CreateHabit 
                key="create"
                onBack={() => setCurrentView('OVERVIEW')}
                onSave={handleAddHabit}
              />
            )}
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Layer 0: Onboarding ---
function Onboarding({ onFinish }: { onFinish: (name: string) => void, key?: string }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-8 h-screen bg-white flex flex-col items-center justify-center text-center overflow-hidden"
    >
      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full space-y-8"
          >
            <div className="w-20 h-20 bg-brand-dark rounded-[24px] mx-auto flex items-center justify-center">
              <Target className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-serif italic text-slate-800 leading-tight">
              Diseña una vida <br /> con intención.
            </h1>
            <div className="space-y-4">
              <div className="flex flex-col items-start gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">¿Cómo te llamas?</span>
                <input 
                  autoFocus
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre aquí"
                  className="w-full text-2xl font-bold bg-slate-50 p-6 rounded-[32px] border-2 border-transparent focus:border-brand-dark focus:bg-white outline-none transition-all placeholder:text-slate-200"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && name.trim()) setStep(2);
                  }}
                />
              </div>
              <button 
                disabled={!name.trim()}
                onClick={() => setStep(2)}
                className="w-full py-6 rounded-[32px] bg-brand-dark text-white font-bold text-lg shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
              >
                Continuar
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="w-full space-y-10"
          >
            <div className="space-y-4">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="w-16 h-16 bg-brand-green/10 rounded-full mx-auto flex items-center justify-center"
              >
                <Heart className="w-8 h-8 text-brand-green" />
              </motion.div>
              <h2 className="text-3xl font-serif italic text-slate-800 leading-tight">
                ¡Gracias <span className="text-brand-green">{name}</span>!
              </h2>
              <p className="text-slate-500 text-lg leading-relaxed px-4">
                Por descargar <span className="font-bold text-brand-dark">MINIMAL HABITS</span>. 
                Te ayudaremos a construir sistemas, no metas. <br />
                <span className="text-slate-400 text-sm italic mt-4 block">"La simplicidad es la forma definitiva de sofisticación."</span>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-left">
              {[
                { icon: Wind, text: "Minimalismo visual", desc: "Sin distracciones." },
                { icon: Trophy, text: "Enfoque en racha", desc: "No rompas la cadena." },
              ].map((item, i) => (
                <div key={i} className="p-4 bg-slate-50 rounded-[28px] border border-slate-100">
                  <item.icon className="w-6 h-6 text-brand-dark mb-2" />
                  <p className="text-[11px] font-bold text-brand-dark uppercase tracking-tight">{item.text}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{item.desc}</p>
                </div>
              ))}
            </div>

            <button 
              onClick={() => onFinish(name)}
              className="w-full py-6 rounded-[32px] bg-brand-dark text-white font-bold text-lg shadow-xl shadow-brand-dark/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Empecemos
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// --- Layer 1: Dashboard ---
function Dashboard({ 
  habits, 
  userName,
  onSelectHabit, 
  onToggleBoolean,
  onUpdateNumeric,
  onCreateNew,
  onViewAnalytics
}: { 
  habits: Habit[], 
  userName: string,
  onSelectHabit: (id: string) => void,
  onToggleBoolean: (id: string) => void,
  onUpdateNumeric: (id: string, amount: number) => void,
  onCreateNew: () => void,
  onViewAnalytics: () => void,
  key?: string
}) {
  const today = getTodayDate();
  
  const dailyProgress = useMemo(() => {
    if (habits.length === 0) return 0;
    const completed = habits.filter(h => {
      const val = h.history[today] || 0;
      return val >= h.target;
    }).length;
    return Math.round((completed / habits.length) * 100);
  }, [habits, today]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="p-6 pb-24 bg-white min-h-screen"
    >
      <header className="flex justify-between items-start mb-8">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">
            {getDayName(today)}, {formatDate(today)}
          </span>
          <h1 className="text-3xl font-semibold tracking-tight text-brand-dark">Hola, {userName || '👋'}</h1>
          <p className="text-[#050505] font-bold text-[13px] mt-1">Tu progreso hoy es del {dailyProgress}%</p>
        </div>
        <button 
          onClick={onViewAnalytics}
          className="p-3 rounded-2xl bg-white border border-slate-100 shadow-sm hover:bg-slate-50 transition-colors"
        >
          <BarChart3 className="w-5 h-5 text-slate-600" />
        </button>
      </header>

      {/* Global Progress Ring */}
      <div className="flex justify-center py-6">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="#F1F3EE"
              strokeWidth="10"
              fill="transparent"
            />
            <motion.circle
              cx="64"
              cy="64"
              r="56"
              stroke="#4CAF50"
              strokeWidth="10"
              fill="transparent"
              strokeDasharray={351.8}
              initial={{ strokeDashoffset: 351.8 }}
              animate={{ strokeDashoffset: 351.8 - (351.8 * dailyProgress) / 100 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-brand-dark">{dailyProgress}%</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xs uppercase tracking-widest font-bold text-gray-400 mb-2 px-1">Tus Hábitos</h2>
        {habits.map((habit, idx) => (
          <HabitCard 
            key={habit.id} 
            habit={habit} 
            index={idx}
            onSelect={() => onSelectHabit(habit.id)}
            onToggle={() => onToggleBoolean(habit.id)}
            onUpdateNumeric={(amount) => onUpdateNumeric(habit.id, amount)}
          />
        ))}
        {habits.length === 0 && (
          <div className="text-center py-12 bg-white/50 rounded-[32px] border-2 border-dashed border-gray-200">
            <p className="text-gray-400">No tienes hábitos todavía.</p>
          </div>
        )}
      </div>

      <button 
        onClick={onCreateNew}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white p-5 rounded-full shadow-xl hover:scale-105 active:scale-95 transition-transform flex items-center justify-center"
      >
        <Plus className="w-6 h-6" />
      </button>
    </motion.div>
  );
}

function HabitCard({ 
  habit, 
  index, 
  onSelect, 
  onToggle,
  onUpdateNumeric 
}: { 
  habit: Habit, 
  index: number, 
  onSelect: () => void,
  onToggle: () => void,
  onUpdateNumeric: (amount: number) => void,
  key?: string
}) {
  const Icon = ICON_MAP[habit.icon] || LayoutGrid;
  const today = getTodayDate();
  const currentVal = habit.history[today] || 0;
  const isCompleted = currentVal >= habit.target;
  const progress = Math.min(100, (currentVal / habit.target) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`p-5 rounded-[32px] border flex flex-col gap-3 transition-all relative overflow-hidden backdrop-blur-sm ${
        isCompleted 
          ? 'bg-[#F2F8F2] border-[#DCE8DC]' 
          : 'bg-white border-slate-100 shadow-sm'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 cursor-pointer flex-1" onClick={onSelect}>
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-xl shadow-sm border border-slate-50">
            <Icon className="w-6 h-6" style={{ color: habit.color }} />
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-bold text-slate-800 leading-tight">{habit.name}</h4>
            <div className="flex justify-between items-center mt-1">
              <span className={`text-xs font-bold uppercase tracking-wide ${isCompleted ? 'text-brand-green' : 'text-slate-400'}`}>
                {habit.type === 'boolean' 
                  ? (isCompleted ? 'Completado' : 'Pendiente') 
                  : `${currentVal} / ${habit.target} ${habit.unit || ''}`}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {habit.type === 'boolean' ? (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onToggle();
              }}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                isCompleted 
                  ? 'bg-brand-green text-white shadow-lg shadow-green-100' 
                  : 'bg-slate-50 border border-slate-100 text-slate-200'
              }`}
            >
              <Check className="w-5 h-5" />
            </button>
          ) : (
            <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
              <button 
                onClick={() => onUpdateNumeric(-1)}
                className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button 
                onClick={() => onUpdateNumeric(1)}
                className="w-8 h-8 rounded-xl bg-brand-dark flex items-center justify-center text-white shadow-md active:scale-90 transition-transform"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button 
                onClick={onSelect}
                className="w-8 h-8 ml-1 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Integrated Progress Bar */}
      {habit.type === 'numeric' && (
        <div className="h-2 bg-white/60 rounded-full overflow-hidden border border-slate-50">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full rounded-full transition-all duration-1000"
            style={{ backgroundColor: habit.color }}
          ></motion.div>
        </div>
      )}
    </motion.div>
  );
}

// --- Layer 2: Habit Detail ---
function HabitDetail({ 
  habit, 
  onBack, 
  onUpdateNumeric, 
  onSetNumeric,
  onDelete,
  onEdit
}: { 
  habit: Habit, 
  onBack: () => void, 
  onUpdateNumeric: (id: string, amount: number) => void, 
  onSetNumeric: (id: string, value: number) => void,
  onDelete: (id: string) => void,
  onEdit: (id: string) => void,
  key?: string
}) {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [entryMode, setEntryMode] = useState<'ADD' | 'SET'>('ADD');
  const Icon = ICON_MAP[habit.icon] || LayoutGrid;
  const today = getTodayDate();
  const currentVal = habit.history[today] || 0;
  const progress = Math.min(100, (currentVal / habit.target) * 100);
  const streak = calculateStreak(habit);

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dStr = d.toISOString().split('T')[0];
    return {
      date: dStr,
      value: habit.history[dStr] || 0,
      completed: (habit.history[dStr] || 0) >= habit.target,
      label: d.toLocaleDateString('es-ES', { weekday: 'narrow' })
    };
  }).reverse();

  const handleExactEntry = () => {
    const input = document.getElementById('exact-entry-input') as HTMLInputElement;
    const val = Number(input.value);
    if (input.value !== '' && !isNaN(val)) {
      if (entryMode === 'ADD') {
        onUpdateNumeric(habit.id, val);
      } else {
        onSetNumeric(habit.id, val);
      }
      input.value = '';
      onBack(); 
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="p-6 h-screen flex flex-col bg-white overflow-hidden"
    >
      <header className="flex justify-between items-center mb-8">
        <button onClick={onBack} className="p-3 rounded-2xl bg-white border border-slate-100 shadow-sm">
          <ChevronLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div className="flex gap-2">
          {!showConfirmDelete ? (
            <>
              <button 
                onClick={() => onEdit(habit.id)}
                className="p-3 rounded-2xl bg-blue-50 border border-blue-100 shadow-sm"
              >
                <Pencil className="w-5 h-5 text-brand-blue" />
              </button>
              <button 
                onClick={() => setShowConfirmDelete(true)}
                className="p-3 rounded-2xl bg-red-50 border border-red-100 shadow-sm"
              >
                <Trash2 className="w-5 h-5 text-red-500" />
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => setShowConfirmDelete(false)}
                className="p-3 rounded-2xl bg-slate-100 text-slate-600 font-bold text-xs"
              >
                Cancelar
              </button>
              <button 
                onClick={() => onDelete(habit.id)}
                className="p-3 rounded-2xl bg-red-500 text-white shadow-xl shadow-red-100"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar space-y-8">
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-slate-50 flex items-center justify-center text-4xl rounded-3xl shadow-sm border border-slate-100 mb-6 font-sans">
            <Icon className="w-10 h-10" style={{ color: habit.color }} />
          </div>
          <h2 className="text-3xl font-serif italic text-slate-800">{habit.name}</h2>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">Detalle y Consistencia</p>
        </div>

        {/* Layered Detail Card */}
        <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm space-y-8">
          <div>
            <div className="flex justify-between items-end text-sm mb-3 font-medium text-slate-500">
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Progreso de hoy</span>
              <span className="text-brand-blue font-bold tracking-tight">{currentVal} / {habit.target} {habit.unit || ''}</span>
            </div>
            <div className="h-4 bg-slate-50 rounded-full overflow-hidden p-1 border border-slate-100/50">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-brand-blue rounded-full shadow-sm shadow-blue-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 rounded-3xl bg-slate-50/50 border border-slate-100">
              <span className="block text-2xl font-bold text-slate-800">{streak}</span>
              <span className="text-[10px] uppercase text-slate-400 font-bold tracking-tighter">Racha Actual</span>
            </div>
            <div className="text-center p-4 rounded-3xl bg-slate-50/50 border border-slate-100">
              <span className="block text-2xl font-bold text-slate-800">{currentVal >= habit.target ? '100' : Math.round(progress)}%</span>
              <span className="text-[10px] uppercase text-slate-400 font-bold tracking-tighter">Cumplimiento</span>
            </div>
          </div>

          {/* Weekly Graph */}
          <div>
            <h4 className="text-[10px] font-bold uppercase text-slate-400 mb-6 tracking-widest">Últimos 7 días</h4>
            <div className="flex justify-between items-end h-28 gap-3 px-2">
              {last7Days.map((day, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full relative flex-1 flex items-end">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.min(100, (day.value / habit.target) * 100)}%` }}
                      className={`w-full rounded-full transition-all duration-500 ${
                        day.completed ? 'bg-brand-blue shadow-sm' : 'bg-slate-100'
                      }`}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">{day.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Interaction Area */}
        <div className="pt-4 space-y-4">
          {habit.type === 'numeric' ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    onUpdateNumeric(habit.id, Math.round(habit.target * 0.1));
                    onBack();
                  }}
                  className="py-5 px-6 bg-brand-blue text-white rounded-3xl font-bold text-sm shadow-xl shadow-blue-100 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <span>+{Math.round(habit.target * 0.1)}</span>
                  <Plus className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    onUpdateNumeric(habit.id, Math.round(habit.target * 0.25));
                    onBack();
                  }}
                  className="py-5 px-6 bg-white border-2 border-brand-blue text-brand-blue rounded-3xl font-bold text-sm hover:bg-blue-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <span>+{Math.round(habit.target * 0.25)}</span>
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 flex flex-col gap-4 focus-within:border-brand-blue transition-colors">
                <div className="flex items-center justify-between gap-2 p-1 bg-slate-100/50 rounded-2xl w-fit">
                  <button 
                    onClick={() => setEntryMode('ADD')}
                    className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${entryMode === 'ADD' ? 'bg-white text-brand-dark shadow-sm' : 'text-slate-400'}`}
                  >
                    Sumar
                  </button>
                  <button 
                    onClick={() => setEntryMode('SET')}
                    className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${entryMode === 'SET' ? 'bg-white text-brand-dark shadow-sm' : 'text-slate-400'}`}
                  >
                    Establecer
                  </button>
                </div>

                <div className="flex items-center justify-between group">
                  <div className="flex flex-col flex-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 italic">
                      {entryMode === 'ADD' ? 'Valor a sumar' : 'Nuevo total hoy'} ({habit.unit})
                    </span>
                    <input 
                      id="exact-entry-input"
                      type="number"
                      placeholder={entryMode === 'ADD' ? '¿Cuánto sumamos?' : '¿Cuál es el total?'}
                      className="w-full text-2xl font-bold bg-transparent outline-none text-slate-800 placeholder:text-slate-200"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleExactEntry();
                        }
                      }}
                    />
                  </div>
                  <button 
                    onClick={handleExactEntry}
                    className="p-4 bg-brand-dark text-white rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => {
                onUpdateNumeric(habit.id, currentVal >= 1 ? -1 : 1);
                onBack();
              }}
              className={`w-full py-5 rounded-[32px] font-bold shadow-xl active:scale-[0.98] transition-all ${
                currentVal >= 1 
                ? 'bg-white border-2 border-brand-green text-brand-green shadow-green-50' 
                : 'bg-brand-dark text-white shadow-brand-dark/20'
              }`}
            >
              {currentVal >= 1 ? 'Marcar como pendiente' : 'Marcar como completado'}
            </button>
          )}

          <button 
            onClick={() => {
              onSetNumeric(habit.id, 0);
              onBack();
            }}
            className="w-full py-4 text-red-500 bg-red-50/50 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-3 h-3" />
            Reiniciar progreso de hoy
          </button>
        </div>

        {/* Configuration Summary */}
        <div className="bg-slate-50/50 rounded-[32px] p-6 border border-slate-100 space-y-4">
          <h4 className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Configuración</h4>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100">
                <CalendarDays className="w-4 h-4 text-slate-600" />
              </div>
              <span className="text-sm font-medium text-slate-700">Frecuencia</span>
            </div>
            <span className="text-xs font-bold text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-100">
              {habit.frequencyType === 'daily' ? 'Diario' : `${habit.frequencyDays?.length} días / sem`}
            </span>
          </div>

          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100">
                <Bell className="w-4 h-4 text-slate-600" />
              </div>
              <span className="text-sm font-medium text-slate-700">Recordatorios</span>
            </div>
            <div className="flex flex-col items-end gap-1">
              {habit.reminderTimes && habit.reminderTimes.length > 0 ? (
                habit.reminderTimes.map((time, idx) => (
                  <span key={idx} className="text-xs font-bold text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-100">
                    {time}
                  </span>
                ))
              ) : (
                <span className="text-xs font-bold text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-100">
                  Desactivado
                </span>
              )}
            </div>
          </div>

          {habit.motivationPhrase && (
            <div className="bg-brand-dark/5 p-4 rounded-2xl border border-brand-dark/10">
              <p className="text-[10px] font-bold text-brand-dark/40 uppercase tracking-widest mb-1 italic">Motivación</p>
              <p className="text-sm font-medium text-brand-dark italic">"{habit.motivationPhrase}"</p>
            </div>
          )}
        </div>

        <div className="h-20" />
      </div>
    </motion.div>
  );
}

// --- Creation Flow ---
function CreateHabit({ 
  onBack, 
  onSave, 
  initialHabit 
}: { 
  onBack: () => void, 
  onSave: (habit: Habit) => void, 
  initialHabit?: Habit,
  key?: string
}) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState(initialHabit?.name || '');
  const [type, setType] = useState<HabitType>(initialHabit?.type || 'boolean');
  const [target, setTarget] = useState(initialHabit?.target || 1);
  const [unit, setUnit] = useState(initialHabit?.unit || '');
  const [icon, setIcon] = useState(initialHabit?.icon || 'Droplets');
  const [color, setColor] = useState(initialHabit?.color || '#4CAF50');
  const [frequencyType, setFrequencyType] = useState<'daily' | 'weekly'>(initialHabit?.frequencyType || 'daily');
  const [frequencyDays, setFrequencyDays] = useState<number[]>(initialHabit?.frequencyDays || [1, 2, 3, 4, 5]);
  const [reminderTimes, setReminderTimes] = useState<string[]>(initialHabit?.reminderTimes || ['08:00']);
  const [hasReminder, setHasReminder] = useState(!!initialHabit?.reminderTimes);
  const [motivationPhrase, setMotivationPhrase] = useState(initialHabit?.motivationPhrase || '');
  const [showNotificationSim, setShowNotificationSim] = useState(false);

  const icons = [
    'Droplets', 'Wind', 'Book', 'Activity', 'Award', 'TrendingUp', 'Sparkles',
    'Dumbbell', 'Bike', 'Waves', 'Trophy', 'Timer', 'Pill', 'Hospital', 
    'Stethoscope', 'Heart', 'Flower', 'Brain', 'Smile', 'Moon', 'Sun', 
    'Coffee', 'Gamepad2', 'Music', 'Camera', 'Apple', 'Zap', 'Laptop',
    'Headset', 'Mic2', 'Lightbulb', 'PenTool', 'Rocket', 'Leaf', 'Dog',
    'Gamepad', 'Dices', 'Coins', 'Wallet', 'Code2', 'Database', 'Cpu',
    'Trees', 'Infinity', 'Star', 'Wine', 'Cloud', 'Car', 'Train', 'Plane',
    'ShoppingCart', 'Languages', 'Utensils', 'GlassWater', 'CigaretteOff', 'Skull'
  ];
  const colors = [
    '#4CAF50', '#4A90E2', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899', '#2A2C29',
    '#06B6D4', '#10B981', '#6366F1', '#F43F5E', '#D946EF', '#84CC16', '#F97316',
    '#0EA5E9', '#64748B', '#A855F7', '#EAB308', '#22C55E', '#3B82F6'
  ];

  const daysLabels = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];

  const toggleDay = (day: number) => {
    if (frequencyDays.includes(day)) {
      setFrequencyDays(frequencyDays.filter(d => d !== day));
    } else {
      setFrequencyDays([...frequencyDays, day].sort());
    }
  };

  const addReminder = () => setReminderTimes([...reminderTimes, '08:00']);
  const removeReminder = (index: number) => setReminderTimes(reminderTimes.filter((_, i) => i !== index));
  const updateReminder = (index: number, time: string) => {
    const newTimes = [...reminderTimes];
    newTimes[index] = time;
    setReminderTimes(newTimes);
  };

  const handleFinish = () => {
    if (!name) return;
    onSave({
      id: initialHabit?.id || Math.random().toString(36).substr(2, 9),
      name,
      type,
      target: type === 'boolean' ? 1 : target,
      unit: type === 'boolean' ? undefined : unit,
      icon,
      color,
      history: initialHabit?.history || {},
      createdAt: initialHabit?.createdAt || Date.now(),
      frequencyType,
      frequencyDays: frequencyType === 'weekly' ? frequencyDays : undefined,
      reminderTimes: hasReminder ? reminderTimes : undefined,
      motivationPhrase: hasReminder ? motivationPhrase : undefined
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      className="p-6 h-screen flex flex-col bg-white overflow-hidden"
    >
      <header className="flex justify-between items-center mb-8">
        <button onClick={onBack} className="p-3 rounded-2xl bg-white border border-slate-100 shadow-sm">
          <X className="w-5 h-5 text-slate-400" />
        </button>
        <div className="flex gap-1.5">
          {[1, 2, 3, 4].map(s => (
            <div key={s} className={`h-1.5 w-8 rounded-full transition-all ${s <= step ? 'bg-brand-dark' : 'bg-slate-100'}`} />
          ))}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            <div className="pt-4">
              <h2 className="text-3xl font-serif italic text-slate-800">Crea tu hábito</h2>
              <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-2">Paso 1: Definición</p>
            </div>
            
            <div className="space-y-6">
              <div className="group bg-slate-50 p-8 rounded-[40px] border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 italic">Asigna un nombre</p>
                <input
                  autoFocus
                  type="text"
                  placeholder="Ej: Meditación Mañana..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-2xl font-bold py-2 bg-transparent border-b-2 border-slate-200 focus:border-brand-dark outline-none transition-colors placeholder:text-slate-200"
                />
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 italic">Tipo de Hábito</p>
                <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setType('boolean')}
                  className={`p-6 rounded-[32px] border-2 transition-all flex flex-col gap-3 text-left ${
                    type === 'boolean' ? 'border-brand-dark bg-slate-50 shadow-sm' : 'border-slate-100'
                  }`}
                >
                  <Check className={`w-6 h-6 ${type === 'boolean' ? 'text-brand-dark' : 'text-slate-200'}`} />
                  <div>
                    <span className="block font-bold text-slate-800">Simple</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter italic">Logrado o no</span>
                  </div>
                </button>
                <button
                  onClick={() => setType('numeric')}
                  className={`p-6 rounded-[32px] border-2 transition-all flex flex-col gap-3 text-left ${
                    type === 'numeric' ? 'border-brand-dark bg-slate-50 shadow-sm' : 'border-slate-100'
                  }`}
                >
                  <Activity className={`w-6 h-6 ${type === 'numeric' ? 'text-brand-dark' : 'text-slate-200'}`} />
                  <div>
                    <span className="block font-bold text-slate-800">Medible</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter italic">Cantidad / Meta</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            <div className="pt-4">
              <h2 className="text-3xl font-serif italic text-slate-800">Define la meta</h2>
              <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-2">Paso 2: Objetivos</p>
            </div>

            {type === 'numeric' ? (
              <div className="space-y-10">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <input
                      type="number"
                      value={target}
                      onChange={(e) => setTarget(Number(e.target.value))}
                      className="w-32 text-4xl font-bold py-2 bg-transparent border-b-2 border-slate-100 focus:border-brand-dark outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Unidad (ml, km...)"
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      className="flex-1 text-2xl font-bold py-2 bg-transparent border-b-2 border-slate-100 focus:border-brand-dark outline-none placeholder:text-slate-200"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['vasos', 'ml', 'min', 'páginas', 'km', 'pasos'].map(u => (
                    <button
                      key={u}
                      onClick={() => setUnit(u)}
                      className={`px-4 py-2 rounded-full border text-[10px] font-bold uppercase transition-all ${
                        unit === u ? 'bg-brand-dark text-white border-brand-dark' : 'bg-white text-slate-400 border-slate-100'
                      }`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 p-8 rounded-[40px] border border-slate-100/50">
                <p className="text-slate-500 font-medium leading-relaxed italic">Este hábito se marca como completado una vez al día. Ideal para tareas binarias como "Meditar" o "Hacer la cama".</p>
              </div>
            )}
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            <div className="pt-4">
              <h2 className="text-3xl font-serif italic text-slate-800">Frecuencia</h2>
              <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-2">Paso 3: Periodicidad</p>
            </div>

            <div className="space-y-10">
              <div className="space-y-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">¿Qué días lo realizarás?</p>
                <div className="flex p-1 bg-slate-50 rounded-2xl border border-slate-100">
                  <button 
                    onClick={() => setFrequencyType('daily')}
                    className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${frequencyType === 'daily' ? 'bg-white shadow-sm text-brand-dark' : 'text-slate-400'}`}
                  >
                    Diario
                  </button>
                  <button 
                    onClick={() => setFrequencyType('weekly')}
                    className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${frequencyType === 'weekly' ? 'bg-white shadow-sm text-brand-dark' : 'text-slate-400'}`}
                  >
                    Días específicos
                  </button>
                </div>

                {frequencyType === 'weekly' && (
                  <div className="flex justify-between items-center bg-slate-50 p-6 rounded-[32px] border border-slate-100">
                    {daysLabels.map((label, i) => (
                      <button
                        key={i}
                        onClick={() => toggleDay(i)}
                        className={`w-10 h-10 rounded-full text-xs font-bold transition-all ${
                          frequencyDays.includes(i) ? 'bg-brand-dark text-white shadow-lg' : 'bg-white text-slate-300'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Recordatorio</p>
                  <button 
                    onClick={() => setHasReminder(!hasReminder)}
                    className={`w-12 h-6 rounded-full transition-all relative ${hasReminder ? 'bg-brand-green' : 'bg-slate-200'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${hasReminder ? 'right-1' : 'left-1'}`} />
                  </button>
                </div>
                
                {hasReminder && (
                  <div className="space-y-6">
                    <div className="bg-brand-dark p-6 rounded-[32px] shadow-xl space-y-4">
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest italic">Horarios de Alerta</p>
                      <div className="space-y-3">
                        {reminderTimes.map((time, idx) => (
                          <div key={idx} className="bg-white/10 p-4 rounded-2xl flex items-center justify-between border border-white/5">
                            <div className="flex items-center gap-3">
                              <Clock className="w-5 h-5 text-white/60" />
                              <span className="text-sm font-bold text-white/80">Alerta {idx + 1}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <input 
                                type="time" 
                                value={time}
                                onChange={(e) => updateReminder(idx, e.target.value)}
                                className="text-lg font-bold text-white bg-transparent outline-none cursor-pointer [color-scheme:dark]"
                              />
                              {reminderTimes.length > 1 && (
                                <button onClick={() => removeReminder(idx)} className="p-1 text-white/40 hover:text-red-400">
                                  <Minus className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      <button 
                        onClick={addReminder}
                        className="w-full py-3 rounded-2xl border-2 border-dashed border-white/10 text-white/40 text-xs font-bold uppercase tracking-widest hover:border-white/20 transition-all flex items-center justify-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Agregar otro
                      </button>

                      <button 
                        onClick={() => setShowNotificationSim(true)}
                        className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                      >
                        <BellRing className="w-4 h-4 text-brand-green" />
                        Simular Notificación
                      </button>
                    </div>

                    <div className="space-y-4">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Frase Motivacional</p>
                      <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 flex items-start gap-4">
                        <Sparkles className="w-5 h-5 text-brand-dark mt-1" />
                        <textarea
                          placeholder="Escribe algo que te motive al recibir la notificación..."
                          value={motivationPhrase}
                          onChange={(e) => setMotivationPhrase(e.target.value)}
                          className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-slate-600 placeholder:text-slate-300 resize-none h-24"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            <div className="pt-4">
              <h2 className="text-3xl font-serif italic text-slate-800">Ajustes finales</h2>
              <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-2">Paso 4: Estética</p>
            </div>

            <div className="space-y-10">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 italic">Elige un icono</p>
                <div className="flex flex-wrap gap-3">
                  {icons.map(i => {
                    const IconComp = ICON_MAP[i] || Activity;
                    return (
                      <button
                        key={i}
                        onClick={() => setIcon(i)}
                        className={`w-14 h-14 rounded-2xl transition-all flex items-center justify-center border shadow-sm ${
                          icon === i ? 'bg-brand-dark text-white border-brand-dark' : 'bg-white text-slate-300 border-slate-50'
                        }`}
                      >
                        <IconComp className="w-6 h-6" />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 italic">Elige un color</p>
                <div className="flex flex-wrap gap-4">
                  {colors.map(c => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={`w-10 h-10 rounded-full transition-all border-4 ${
                        color === c ? 'scale-125 border-white shadow-xl' : 'border-transparent shadow-sm opacity-60'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <footer className="py-8 bg-white/80 backdrop-blur-sm flex gap-4">
        {step > 1 && (
          <button
            onClick={() => setStep(step - 1)}
            className="flex-1 py-5 rounded-[32px] border-2 border-slate-100 text-slate-600 font-bold hover:bg-slate-50 transition-all"
          >
            Atrás
          </button>
        )}
        <button
          onClick={() => step < 4 ? setStep(step + 1) : handleFinish()}
          className={`${step > 1 ? 'flex-[2]' : 'w-full'} py-5 rounded-[32px] bg-brand-dark text-white font-bold shadow-2xl shadow-brand-dark/30 hover:scale-[1.02] active:scale-[0.98] transition-all`}
        >
          {step === 4 ? (initialHabit ? 'Guardar Cambios' : 'Empezar Hábito') : 'Siguiente Paso'}
        </button>
      </footer>

      {/* Notification Simulation Pop-up */}
      <AnimatePresence>
        {showNotificationSim && (
          <motion.div 
            initial={{ y: -100, opacity: 0, x: '-50%' }}
            animate={{ y: 0, opacity: 1, x: '-50%' }}
            exit={{ y: -100, opacity: 0, x: '-50%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-12 left-1/2 z-[100] w-[90%] max-w-sm"
          >
            <div className="bg-brand-dark/95 backdrop-blur-md rounded-[28px] p-4 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] ring-1 ring-white/20">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-brand-green rounded-lg flex items-center justify-center">
                    <Target className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-[10px] font-bold text-white/60 uppercase tracking-[0.2em]">Minimal Reminder</span>
                </div>
                <button 
                  onClick={() => setShowNotificationSim(false)}
                  className="p-1 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-white/40" />
                </button>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <h3 className="text-white font-bold text-sm tracking-tight">{name || 'Nuevo Hábito'}</h3>
                  <p className="text-white/70 text-[11px] mt-0.5 leading-relaxed font-medium">
                    {motivationPhrase || '¡Es momento de mantener tu racha! Dale con todo hoy.'}
                  </p>
                </div>
                
                <div className="flex flex-col gap-1.5 min-w-[70px]">
                  <button 
                    onClick={() => setShowNotificationSim(false)}
                    className="py-1.5 px-3 rounded-full bg-brand-green text-white text-[9px] font-bold uppercase tracking-wider shadow-lg shadow-green-500/20 active:scale-95 transition-all text-center"
                  >
                    Hecho
                  </button>
                  <button 
                    onClick={() => setShowNotificationSim(false)}
                    className="py-1.5 px-3 rounded-full bg-white/10 text-white text-[9px] font-bold uppercase tracking-wider hover:bg-white/20 active:scale-95 transition-all text-center"
                  >
                    Luego
                  </button>
                </div>
              </div>

              {/* Progress bar simulation for auto-dismiss */}
              <motion.div 
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 6, ease: 'linear' }}
                onAnimationComplete={() => setShowNotificationSim(false)}
                className="absolute bottom-0 left-4 right-4 h-0.5 bg-white/10 rounded-full overflow-hidden mt-3"
              >
                <div className="h-full bg-brand-green/30" />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// --- Layer 3: Analytics Dashboard ---
function Analytics({ habits, onBack }: { habits: Habit[], onBack: () => void, key?: string }) {
  const [timeframe, setTimeframe] = useState<'WEEK' | 'MONTH' | 'YEAR'>('MONTH');
  const today = getTodayDate();
  
  const data = useMemo(() => {
    const items: { date: string, percent: number, label: string | number }[] = [];
    let length = 0;
    
    if (timeframe === 'WEEK') length = 7;
    else if (timeframe === 'MONTH') length = 30;
    else if (timeframe === 'YEAR') length = 12;

    if (timeframe === 'YEAR') {
      for (let i = 0; i < 12; i++) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const month = d.getMonth();
        const year = d.getFullYear();
        
        const monthHabitsCount = habits.length;
        if (monthHabitsCount === 0) {
          items.push({ date: `${year}-${month}`, percent: 0, label: d.toLocaleDateString('es-ES', { month: 'short' }) });
          continue;
        }

        let totalCompletions = 0;
        let daysInMonth = 0;
        const lastDay = new Date(year, month + 1, 0).getDate();
        
        for (let day = 1; day <= lastDay; day++) {
          const dStr = new Date(year, month, day).toISOString().split('T')[0];
          totalCompletions += habits.filter(h => (h.history[dStr] || 0) >= h.target).length;
          daysInMonth++;
        }

        const possible = monthHabitsCount * daysInMonth;
        items.push({ 
          date: `${year}-${month}`, 
          percent: possible > 0 ? (totalCompletions / possible) * 100 : 0, 
          label: d.toLocaleDateString('es-ES', { month: 'short' }) 
        });
      }
    } else {
      for (let i = 0; i < length; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dStr = d.toISOString().split('T')[0];
        
        if (habits.length === 0) {
          items.push({ date: dStr, percent: 0, label: d.getDate() });
          continue;
        }
        
        const completed = habits.filter(h => {
          const val = h.history[dStr] || 0;
          return val >= h.target;
        }).length;
        items.push({
          date: dStr,
          percent: (completed / habits.length) * 100,
          label: timeframe === 'WEEK' ? d.toLocaleDateString('es-ES', { weekday: 'narrow' }) : d.getDate()
        });
      }
    }
    
    return items.reverse();
  }, [habits, timeframe]);

  const totalCompliance = useMemo(() => {
    if (data.length === 0) return 0;
    const sum = data.reduce((acc, curr) => acc + curr.percent, 0);
    return Math.round(sum / data.length);
  }, [data]);

  const bestHabit = useMemo(() => {
    if (habits.length === 0) return null;
    return habits.reduce((prev, current) => {
      const prevComp = Object.values(prev.history).filter(v => v >= prev.target).length;
      const currentComp = Object.values(current.history).filter(v => v >= current.target).length;
      return currentComp > prevComp ? current : prev;
    });
  }, [habits]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="p-6 h-screen flex flex-col bg-white overflow-hidden"
    >
      <header className="flex justify-between items-center mb-6">
        <button onClick={onBack} className="p-3 rounded-2xl bg-white border border-slate-100 shadow-sm">
          <ChevronLeft className="w-5 h-5 text-slate-600" />
        </button>
        <h2 className="text-xl font-serif italic text-slate-800">Estadísticas</h2>
        <div className="w-11" />
      </header>

      {/* Timeframe Selector */}
      <div className="flex p-1 bg-slate-50 rounded-2xl mb-8 border border-slate-100">
        {(['WEEK', 'MONTH', 'YEAR'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTimeframe(t)}
            className={`flex-1 py-2.5 rounded-xl text-[10px] font-bold uppercase transition-all ${
              timeframe === t ? 'bg-white shadow-sm text-brand-dark' : 'text-slate-400'
            }`}
          >
            {t === 'WEEK' ? 'Semana' : t === 'MONTH' ? 'Mes' : 'Año'}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar space-y-8 pb-20">
        <div className="text-center bg-slate-50/50 rounded-[40px] py-10 border border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Consistencia {timeframe === 'WEEK' ? 'Semanal' : timeframe === 'MONTH' ? 'Mensual' : 'Anual'}</p>
          <h3 className="text-7xl font-bold text-slate-800 tracking-tighter">{totalCompliance}%</h3>
          <p className="text-brand-green mt-3 font-bold text-xs uppercase tracking-tight">Evolución positiva</p>
        </div>

        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
          <h4 className="text-[10px] font-bold uppercase text-slate-400 mb-8 tracking-widest">
            Tendencia ({timeframe === 'WEEK' ? '7 días' : timeframe === 'MONTH' ? '30 días' : '12 meses'})
          </h4>
          <div className="flex items-end h-32 gap-1.5 px-1">
            {data.map((item, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                <div className="w-full relative flex-1 flex items-end">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${item.percent}%` }}
                    className={`w-full rounded-full transition-all duration-700 ${
                      item.percent === 100 ? 'bg-brand-green' : item.percent > 50 ? 'bg-brand-blue' : 'bg-slate-100'
                    }`}
                  />
                  <div className="absolute bottom-full mb-1 hidden group-hover:block bg-brand-dark text-white text-[8px] p-1 rounded z-20">
                    {Math.round(item.percent)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 px-1 text-[10px] font-bold text-slate-300 uppercase">
            <span>{timeframe === 'WEEK' ? 'Lunes' : timeframe === 'MONTH' ? 'Hace 1 mes' : 'Hace 1 año'}</span>
            <span>Hoy</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm text-center">
            <div className="w-10 h-10 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Flame className="w-5 h-5 text-orange-500" />
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-1">Racha</p>
            <h5 className="text-xl font-bold text-slate-800">
              {habits.length > 0 ? Math.max(...habits.map(h => calculateStreak(h)), 0) : 0}d
            </h5>
          </div>
          
          <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm text-center">
            <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Award className="w-5 h-5 text-brand-blue" />
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-1">Top</p>
            <h5 className="text-xl font-bold text-slate-800 truncate px-1">
              {bestHabit?.name || '---'}
            </h5>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="px-2 text-[10px] font-bold uppercase text-slate-400 tracking-widest">Desglose por Hábito</h4>
          {habits.map(habit => {
            const historyValues = Object.values(habit.history);
            const total = historyValues.length;
            const completed = historyValues.filter(v => v >= habit.target).length;
            const trend = total > 0 ? (completed / total) * 100 : 0;
            const Icon = ICON_MAP[habit.icon] || LayoutGrid;

            return (
              <div key={habit.id} className="bg-white p-5 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-slate-50 shadow-sm" style={{ backgroundColor: `${habit.color}15` }}>
                  <Icon className="w-5 h-5" style={{ color: habit.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="text-xs font-bold text-slate-800 truncate">{habit.name}</h5>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1 bg-slate-50 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${trend}%`, backgroundColor: habit.color }} />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">{Math.round(trend)}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
