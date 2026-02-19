import { useState, useEffect } from 'react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, subDays, getDay } from 'date-fns';
import { getBodyWeights, getWorkouts, MUSCLE_GROUPS } from '../utils/storage';
import { ChevronRight } from 'lucide-react';

export default function Dashboard({ onNavigate }) {
    const [weights, setWeights] = useState([]);
    const [workouts, setWorkouts] = useState([]);
    const [today] = useState(new Date());

    useEffect(() => {
        setWeights(getBodyWeights());
        setWorkouts(getWorkouts());
    }, []);

    const WeighInModule = () => {
        const last7Days = eachDayOfInterval({
            start: subDays(today, 6),
            end: today
        });

        return (
            <div className="card" onClick={() => onNavigate('weight')}>
                <div className="flex-row" style={{ justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div className="flex-row" style={{ gap: '0.5rem' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent)' }} />
                        <h3>Weigh-In</h3>
                    </div>
                    <ChevronRight size={20} color="var(--text-secondary)" />
                </div>

                <div className="flex-row" style={{ justifyContent: 'space-between', marginTop: '1rem' }}>
                    {last7Days.map(day => {
                        const hasEntry = weights.some(w => isSameDay(new Date(w.date), day));
                        return (
                            <div key={day.toString()} className="flex-col" style={{ alignItems: 'center', gap: '4px' }}>
                                <div style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    background: hasEntry ? 'var(--accent)' : '#222',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: hasEntry ? '#000' : '#444',
                                    fontWeight: 'bold',
                                    fontSize: '0.8rem'
                                }}>
                                    {format(day, 'd')}
                                </div>
                                <span style={{ fontSize: '0.6rem', color: '#666' }}>{format(day, 'EEE')}</span>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    };

    const WorkoutHabit = () => {
        const last7Days = eachDayOfInterval({
            start: subDays(today, 6),
            end: today
        });

        return (
            <div className="card">
                <div className="flex-row" style={{ justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <h3>Workout Consistency</h3>
                </div>

                <div className="flex-row" style={{ justifyContent: 'space-between', marginTop: '1rem' }}>
                    {last7Days.map(day => {
                        const hasWorkout = workouts.some(w => {
                            const dateStr = w.startTime || w.endTime || w.date;
                            if (!dateStr) return false;
                            return isSameDay(new Date(dateStr), day);
                        });
                        return (
                            <div key={day.toString()} className="flex-col" style={{ alignItems: 'center', gap: '4px' }}>
                                <div style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    background: hasWorkout ? 'var(--accent)' : '#222',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: hasWorkout ? '#000' : '#444',
                                    fontWeight: 'bold',
                                    fontSize: '0.8rem'
                                }}>
                                    {format(day, 'd')}
                                </div>
                                <span style={{ fontSize: '0.6rem', color: '#666' }}>{format(day, 'EEE')}</span>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    };

    return (
        <div className="flex-col" style={{ gap: '1rem' }}>
            <h1 style={{ marginBottom: '0.5rem' }}>Dashboard</h1>

            <div className="flex-col" style={{ gap: '1rem' }}>
                <h3 className="text-secondary" style={{ textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>Habits</h3>
                <WeighInModule />
                <WorkoutHabit />
            </div>

            <div className="flex-col" style={{ gap: '1rem', marginTop: '1rem' }}>
                <h3 className="text-secondary" style={{ textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>Muscle Groups</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    {MUSCLE_GROUPS.map(muscle => (
                        <div key={muscle} onClick={() => onNavigate('muscle', muscle)} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', cursor: 'pointer' }}>
                            <span style={{ fontWeight: 'bold' }}>{muscle}</span>
                            <span className="text-secondary" style={{ fontSize: '0.8rem' }}>View History</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
