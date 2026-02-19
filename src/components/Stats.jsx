import { useState, useEffect } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { getWorkouts, getBodyWeights } from '../utils/storage';
import { format } from 'date-fns';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const chartOptions = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
            labels: { color: '#fff' }
        },
    },
    scales: {
        y: {
            ticks: { color: '#aaa' },
            grid: { color: '#333' }
        },
        x: {
            ticks: { color: '#aaa' },
            grid: { color: '#333' }
        }
    }
};

const Stats = () => {
    const [workouts, setWorkouts] = useState([]);
    const [bodyWeights, setBodyWeights] = useState([]);
    const [selectedExercise, setSelectedExercise] = useState('');
    const [availableExercises, setAvailableExercises] = useState([]);

    useEffect(() => {
        const loadedWorkouts = getWorkouts();
        const loadedBodyWeights = getBodyWeights();
        setWorkouts(loadedWorkouts);
        setBodyWeights(loadedBodyWeights);

        // Extract unique exercise names
        const exercises = new Set();
        loadedWorkouts.forEach(w => {
            w.exercises.forEach(e => {
                if (e.name) exercises.add(e.name);
            });
        });
        setAvailableExercises(Array.from(exercises));
        if (exercises.size > 0) setSelectedExercise(Array.from(exercises)[0]);
    }, []);

    // Body Weight Data
    const bodyWeightData = {
        labels: bodyWeights.map(bw => format(new Date(bw.date), 'MM/dd')),
        datasets: [
            {
                label: 'Body Weight (kg)',
                data: bodyWeights.map(bw => bw.weight),
                borderColor: '#4ade80',
                backgroundColor: 'rgba(74, 222, 128, 0.5)',
            },
        ],
    };

    // Workout Volume Data (Total Weight Lifted per Workout)
    const volumeData = {
        labels: workouts.map(w => format(new Date(w.endTime || w.startTime), 'MM/dd')),
        datasets: [
            {
                label: 'Total Volume (kg)',
                data: workouts.map(w =>
                    w.exercises.reduce((acc, ex) =>
                        acc + ex.sets.reduce((sAcc, s) => sAcc + (Number(s.weight) * Number(s.reps)), 0)
                        , 0)
                ),
                backgroundColor: '#3b82f6',
            },
        ],
    };

    // Exercise Progression Data (Max Weight per workout for selected exercise)
    const getExerciseData = () => {
        if (!selectedExercise) return { labels: [], datasets: [] };

        const dataPoints = workouts.map(w => {
            const exercise = w.exercises.find(e => e.name === selectedExercise);
            if (!exercise) return null;
            const maxWeight = Math.max(...exercise.sets.map(s => Number(s.weight) || 0));
            return {
                date: w.endTime || w.startTime,
                weight: maxWeight
            };
        }).filter(d => d !== null);

        return {
            labels: dataPoints.map(d => format(new Date(d.date), 'MM/dd')),
            datasets: [
                {
                    label: `Max ${selectedExercise} Weight (kg)`,
                    data: dataPoints.map(d => d.weight),
                    borderColor: '#f472b6',
                    backgroundColor: 'rgba(244, 114, 182, 0.5)',
                }
            ]
        };
    };

    return (
        <div className="flex-col" style={{ paddingBottom: '2rem' }}>
            <div className="card">
                <h2>Body Weight Trend</h2>
                <div style={{ height: '300px' }}>
                    {bodyWeights.length > 0 ? <Line options={chartOptions} data={bodyWeightData} /> : <p className="text-secondary">Not enough data.</p>}
                </div>
            </div>

            <div className="card">
                <h2>Workout Volume</h2>
                <div style={{ height: '300px' }}>
                    {workouts.length > 0 ? <Bar options={chartOptions} data={volumeData} /> : <p className="text-secondary">Not enough data.</p>}
                </div>
            </div>

            <div className="card">
                <div className="flex-row" style={{ justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <h2>Strength Progress</h2>
                    <select
                        value={selectedExercise}
                        onChange={(e) => setSelectedExercise(e.target.value)}
                        style={{ padding: '0.5rem', borderRadius: '4px', background: '#333', color: '#fff', border: 'none' }}
                    >
                        {availableExercises.map(ex => <option key={ex} value={ex}>{ex}</option>)}
                    </select>
                </div>
                <div style={{ height: '300px' }}>
                    {selectedExercise && workouts.length > 0 ? <Line options={chartOptions} data={getExerciseData()} /> : <p className="text-secondary">Log workouts to see progress.</p>}
                </div>
            </div>
        </div>
    );
};

export default Stats;
