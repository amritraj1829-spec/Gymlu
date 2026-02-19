import { useState } from 'react';
import { ChevronLeft, TrendingUp, ChevronRight } from 'lucide-react';
import { getWorkouts, getExerciseHistory, getLastSessionStats } from '../utils/storage';
import { Line } from 'react-chartjs-2';
import { format } from 'date-fns';

const MuscleDetail = ({ muscle, onBack }) => {
    const [selectedExercise, setSelectedExercise] = useState(null);
    const workouts = getWorkouts();

    const allExercisesInHistory = Array.from(new Set(workouts.flatMap(w => w.exercises?.map(e => e.name) || [])));

    if (selectedExercise) {
        return <ExerciseDetail exerciseName={selectedExercise} onBack={() => setSelectedExercise(null)} />;
    }

    return (
        <div className="flex-col">
            <div className="flex-row" style={{ marginBottom: '1rem' }}>
                <button onClick={onBack} style={{ padding: '0.5rem', background: 'transparent' }}><ChevronLeft /></button>
                <h2>{muscle}</h2>
            </div>

            <div className="card">
                <h3>Exercises</h3>
                <div className="flex-col" style={{ gap: '0.5rem', marginTop: '1rem' }}>
                    {allExercisesInHistory.length === 0 && <p className="text-secondary">No exercises recorded yet.</p>}
                    {allExercisesInHistory.map(ex => (
                        <div key={ex} className="card" style={{ padding: '1rem', background: '#333' }} onClick={() => setSelectedExercise(ex)}>
                            <div className="flex-row" style={{ justifyContent: 'space-between' }}>
                                <span style={{ fontWeight: '500' }}>{ex}</span>
                                <ChevronRight size={16} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const ExerciseDetail = ({ exerciseName, onBack }) => {
    const history = getExerciseHistory(exerciseName);
    const pr = Math.max(...history.flatMap(h => h.sets.map(s => Number(s.weight) || 0)), 0);

    const chartData = {
        labels: history.map(h => format(new Date(h.date), 'MM/dd')).reverse(),
        datasets: [{
            label: 'Max Weight',
            data: history.map(h => Math.max(...h.sets.map(s => Number(s.weight) || 0))).reverse(),
            borderColor: '#f472b6',
            tension: 0.3
        }]
    };

    return (
        <div className="flex-col">
            <div className="flex-row" style={{ marginBottom: '1rem' }}>
                <button onClick={onBack} style={{ padding: '0.5rem', background: 'transparent' }}><ChevronLeft /></button>
                <h2>{exerciseName}</h2>
            </div>

            <div className="card flex-row" style={{ alignItems: 'center', gap: '1rem' }}>
                <div style={{ background: 'rgba(244, 114, 182, 0.2)', padding: '0.75rem', borderRadius: '50%' }}>
                    <TrendingUp size={24} color="#f472b6" />
                </div>
                <div className="flex-col" style={{ gap: '0px' }}>
                    <span className="text-secondary" style={{ fontSize: '0.8rem' }}>Personal Record</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{pr} kg</span>
                </div>
            </div>

            <div className="card">
                <h3>Progress</h3>
                <div style={{ height: '200px' }}>
                    <Line options={{ maintainAspectRatio: false }} data={chartData} />
                </div>
            </div>

            <div className="card">
                <h3>History</h3>
                <div className="flex-col" style={{ gap: '1rem', marginTop: '1rem' }}>
                    {history.slice(0, 10).map((h, i) => (
                        <div key={i} style={{ borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>
                            <div className="text-secondary" style={{ fontSize: '0.8rem', marginBottom: '0.25rem' }}>{format(new Date(h.date), 'PPP')}</div>
                            {h.sets.map((s, idx) => (
                                <div key={idx} className="flex-row" style={{ justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                    <span>Set {idx + 1}</span>
                                    <span>{s.weight}kg x {s.reps}</span>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default MuscleDetail;
