import { useState } from 'react';
import './utils/chartSetup';
import { Activity, Scale, BarChart2, Home, Plus, User } from 'lucide-react';
import Dashboard from './components/Dashboard';
import WorkoutDayView from './components/WorkoutDayView';
import Stats from './components/Stats';
import WeighInView from './components/WeighInView';
import MuscleDetail from './components/MuscleDetail';
import RoutinePlanner from './components/RoutinePlanner';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Account from './components/auth/Account';
import { MUSCLE_GROUPS } from './utils/storage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './index.css';

function AppContent() {
  const { user, loading } = useAuth();
  const [view, setView] = useState('dashboard');
  const [subView, setSubView] = useState(null);

  if (loading) {
    return (
      <div className="flex-col" style={{ height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
        <h2 className="accent">Gymlu</h2>
        <p className="text-secondary">Loading your profile...</p>
      </div>
    );
  }

  // Handle Navigation and Pseudo-Routing
  const handleNavigate = (newView, param) => {
    if (newView === 'muscle') {
      setView('dashboard');
      setSubView({ type: 'muscle', value: param });
      return;
    }
    if (newView === 'weight') {
      setView('dashboard');
      setSubView('weight');
      return;
    }

    setView(newView);
    setSubView(null);
  };

  // Redirect to Login if not authenticated
  if (!user && view !== 'signup') {
    return <Login onNavigate={handleNavigate} />;
  }

  if (!user && view === 'signup') {
    return <Signup onNavigate={handleNavigate} />;
  }

  return (
    <div className="app-container">
      <main style={{ flex: 1, paddingBottom: '90px' }}>
        {view === 'dashboard' && !subView && <Dashboard onNavigate={handleNavigate} />}

        {view === 'dashboard' && subView === 'weight' && <WeighInView onBack={() => setSubView(null)} />}
        {view === 'dashboard' && subView && typeof subView === 'object' && subView.type === 'muscle' && (
          <MuscleDetail muscle={subView.value} onBack={() => setSubView(null)} />
        )}

        {view === 'workout' && <WorkoutDayView />}
        {view === 'stats' && <Stats />}
        {view === 'planner' && <RoutinePlanner />}
        {view === 'account' && <Account onBack={() => setView('dashboard')} />}
      </main>

      <nav className="flex-row" style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'var(--bg-secondary)',
        padding: '0.75rem',
        justifyContent: 'space-around',
        borderTop: '1px solid var(--border)',
        zIndex: 100
      }}>
        <button
          onClick={() => setView('dashboard')}
          className="flex-col"
          style={{
            background: 'transparent',
            gap: '4px',
            opacity: view === 'dashboard' ? 1 : 0.5,
            color: view === 'dashboard' ? 'var(--accent)' : 'var(--text-primary)',
            alignItems: 'center',
            padding: 0
          }}
        >
          <Home size={24} />
          <span style={{ fontSize: '0.7rem' }}>Home</span>
        </button>

        <button
          onClick={() => setView('workout')}
          className="flex-col"
          style={{
            background: 'transparent',
            gap: '4px',
            opacity: view === 'workout' ? 1 : 0.5,
            color: view === 'workout' ? 'var(--accent)' : 'var(--text-primary)',
            alignItems: 'center',
            padding: 0
          }}
        >
          <Activity size={24} />
          <span style={{ fontSize: '0.7rem' }}>Workout</span>
        </button>

        <button
          onClick={() => setView('planner')}
          style={{
            background: 'var(--accent)',
            color: '#000',
            borderRadius: '50%',
            width: '48px',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '0px',
            boxShadow: '0 4px 12px rgba(74, 222, 128, 0.4)'
          }}
        >
          <Plus size={28} strokeWidth={2.5} />
        </button>

        <button
          onClick={() => setView('stats')}
          className="flex-col"
          style={{
            background: 'transparent',
            gap: '4px',
            opacity: view === 'stats' ? 1 : 0.5,
            color: view === 'stats' ? 'var(--accent)' : 'var(--text-primary)',
            alignItems: 'center',
            padding: 0
          }}
        >
          <BarChart2 size={24} />
          <span style={{ fontSize: '0.7rem' }}>Stats</span>
        </button>

        <button
          onClick={() => setView('account')}
          className="flex-col"
          style={{
            background: 'transparent',
            gap: '4px',
            opacity: view === 'account' ? 1 : 0.5,
            color: view === 'account' ? 'var(--accent)' : 'var(--text-primary)',
            alignItems: 'center',
            padding: 0
          }}
        >
          <User size={24} />
          <span style={{ fontSize: '0.7rem' }}>Account</span>
        </button>
      </nav>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
