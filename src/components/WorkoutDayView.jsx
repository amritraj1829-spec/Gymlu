import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { getWorkoutPlans, saveWorkout, getLastSessionStats } from '../utils/storage';
import { nanoid } from 'nanoid';
import { Plus, Check, Save, ChevronDown, ChevronUp } from 'lucide-react';

const WorkoutDayView = () => {
    const [today, setToday] = useState(new Date());
    const [plan, setPlan] = useState(null);
    const [activeExercises, setActiveExercises] = useState([]); // Exercises being tracked in current session
    const [finished, setFinished] = useState(false);

    useEffect(() => {
        const currentDay = format(today, 'EEEE'); // e.g., "Monday"
        const allPlans = getWorkoutPlans();
        const dailyPlan = allPlans[currentDay];
        setPlan(dailyPlan);

        if (dailyPlan && dailyPlan.exercises) {
            // Initialize active session with planned exercises
            setActiveExercises(dailyPlan.exercises.map(ex => ({
                ...ex,
                sets: [] // Start with empty sets
            })));
        } else {
            setActiveExercises([]);
        }
    }, []);

    const addSet = (exerciseIndex) => {
        setActiveExercises(prev => prev.map((ex, idx) => {
            if (idx !== exerciseIndex) return ex;
            return {
                ...ex,
                sets: [...ex.sets, {
                    id: nanoid(),
                    weight: '',
                    reps: '',
                    partialReps: ''
                }]
            };
        }));
    };

    const updateSet = (exerciseIndex, setIndex, field, value) => {
        setActiveExercises(prev => prev.map((ex, idx) => {
            if (idx !== exerciseIndex) return ex;
            return {
                ...ex,
                sets: ex.sets.map((set, sIdx) => {
                    if (sIdx !== setIndex) return set;
                    return { ...set, [field]: value };
                })
            };
        }));
    };

    const finishWorkout = () => {
        const workoutData = {
            id: nanoid(),
            date: today.toISOString(),
            endTime: new Date().toISOString(),
            day: format(today, 'EEEE'),
            exercises: activeExercises.filter(ex => ex.sets.length > 0) // Only save exercises with sets
        };
        saveWorkout(workoutData);
        setFinished(true);
    };

    if (finished) {
        return (
            <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <div style={{ background: 'var(--accent)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                    <Check size={40} color="#000" />
                </div>
                <h2>Workout Saved!</h2>
                <p className="text-secondary">Great job crushing your {format(today, 'EEEE')} workout.</p>
                <button onClick={() => window.location.reload()} style={{ marginTop: '2rem', background: '#333' }}>Back to Home</button>
            </div>
        );
    }

    return (
        <div className="flex-col" style={{ paddingBottom: '2rem' }}>
            {/* Header */}
            <div className="card" style={{ background: 'linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 100%)' }}>
                <span className="text-secondary" style={{ fontSize: '0.9rem', textTransform: 'uppercase' }}>{format(today, 'MMMM d, yyyy')}</span>
                <h1 style={{ color: 'var(--accent)', fontSize: '2.5rem' }}>{format(today, 'EEEE')}</h1>
                <div className="flex-row" style={{ gap: '8px', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                    {plan?.muscles?.map(m => (
                        <span key={m} style={{ fontSize: '0.75rem', padding: '4px 8px', background: '#333', borderRadius: '4px', color: '#fff' }}>{m}</span>
                    ))}
                    {!plan && <span className="text-secondary">No specific plan for today.</span>}
                </div>
            </div>

            {/* Exercise List */}
            <div className="flex-col" style={{ gap: '1rem' }}>
                {activeExercises.map((exercise, idx) => {
                    const lastSession = getLastSessionStats(exercise.name);

                    return (
                        <div key={exercise.id} className="card">
                            <h3 style={{ marginBottom: '0.5rem' }}>{exercise.name}</h3>

                            {/* Previous Session Info */}
                            {lastSession && (
                                <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '1rem', background: '#252525', padding: '0.5rem', borderRadius: '4px' }}>
                                    Last: {lastSession.sets.length} sets • Max {Math.max(...lastSession.sets.map(s => s.weight || 0))}kg
                                </div>
                            )}

                            {/* Sets Header */}
                            <div className="flex-row" style={{ marginBottom: '0.5rem', paddingRight: '2rem' }}>
                                <span className="text-secondary" style={{ width: '30px', textAlign: 'center', fontSize: '0.8rem' }}>Set</span>
                                <span className="text-secondary" style={{ flex: 1, textAlign: 'center', fontSize: '0.8rem' }}>kg</span>
                                <span className="text-secondary" style={{ flex: 1, textAlign: 'center', fontSize: '0.8rem' }}>Reps</span>
                                <span className="text-secondary" style={{ flex: 1, textAlign: 'center', fontSize: '0.8rem' }}>PAR</span>
                            </div>

                            {/* Sets Inputs */}
                            <div className="flex-col" style={{ gap: '0.5rem' }}>
                                {exercise.sets.map((set, setIdx) => (
                                    <div key={set.id} className="flex-row">
                                        <span className="text-secondary" style={{ width: '30px', textAlign: 'center' }}>{setIdx + 1}</span>
                                        <input
                                            type="number"
                                            placeholder="-"
                                            value={set.weight}
                                            onChange={(e) => updateSet(idx, setIdx, 'weight', e.target.value)}
                                            style={{ flex: 1, textAlign: 'center' }}
                                        />
                                        <input
                                            type="number"
                                            placeholder="-"
                                            value={set.reps}
                                            onChange={(e) => updateSet(idx, setIdx, 'reps', e.target.value)}
                                            style={{ flex: 1, textAlign: 'center' }}
                                        />
                                        <input
                                            type="number"
                                            placeholder="-"
                                            value={set.partialReps}
                                            onChange={(e) => updateSet(idx, setIdx, 'partialReps', e.target.value)}
                                            style={{ flex: 1, textAlign: 'center', background: '#2a2a2a', border: '1px solid #444' }}
                                        />
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => addSet(idx)}
                                style={{ width: '100%', marginTop: '1rem', background: '#333', padding: '0.5rem', fontSize: '0.9rem' }}
                            >
                                <Plus size={16} style={{ verticalAlign: 'middle' }} /> Add Set
                            </button>
                        </div>
                    );
                })}

                {activeExercises.length === 0 && (
                    <div className="card" style={{ textAlign: 'center' }}>
                        <p className="text-secondary">No exercises. Go to Planner (+) to set up today's routine.</p>
                    </div>
                )}
            </div>

            {activeExercises.length > 0 && (
                <button
                    onClick={finishWorkout}
                    className="flex-row"
                    style={{
                        justifyContent: 'center',
                        background: 'var(--accent)',
                        color: '#000',
                        fontWeight: 'bold',
                        padding: '1rem',
                        position: 'fixed',
                        bottom: '80px',
                        left: '1rem',
                        right: '1rem',
                        width: 'calc(100% - 2rem)',
                        maxWidth: 'calc(600px - 2rem)',
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                        zIndex: 90
                    }}
                >
                    <Save size={20} /> Finish Workout
                </button>
            )}
        </div>
    );
};

export default WorkoutDayView;
