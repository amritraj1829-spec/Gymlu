import { useState, useEffect } from 'react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, subMonths, subYears, startOfMonth, endOfMonth, getDay } from 'date-fns';
import { getBodyWeights, saveBodyWeight } from '../utils/storage';
import { Line } from 'react-chartjs-2';
import { ChevronLeft, Plus } from 'lucide-react';
import { nanoid } from 'nanoid';

const WeighInView = ({ onBack }) => {
    const [weights, setWeights] = useState([]);
    const [weightInput, setWeightInput] = useState('');
    const [viewMode, setViewMode] = useState('weekly'); // weekly, monthly, yearly

    useEffect(() => {
        setWeights(getBodyWeights());
    }, []);

    const handleSave = () => {
        if (!weightInput) return;
        const entry = {
            id: nanoid(),
            date: new Date().toISOString(),
            weight: parseFloat(weightInput)
        };
        saveBodyWeight(entry);
        setWeights([...weights, entry]);
        setWeightInput('');
    };

    const getChartData = () => {
        const today = new Date();
        let startDate;

        if (viewMode === 'weekly') startDate = startOfWeek(today);
        else if (viewMode === 'monthly') startDate = subMonths(today, 1);
        else startDate = subYears(today, 1);

        const filteredWeights = weights.filter(w => new Date(w.date) >= startDate);
        filteredWeights.sort((a, b) => new Date(a.date) - new Date(b.date));

        return {
            labels: filteredWeights.map(w => format(new Date(w.date), viewMode === 'weekly' ? 'EEE' : 'MMM d')),
            datasets: [{
                label: 'Weight',
                data: filteredWeights.map(w => w.weight),
                borderColor: '#4ade80',
                backgroundColor: 'rgba(74, 222, 128, 0.1)',
                fill: true,
                tension: 0.4
            }]
        };
    };

    const CalendarView = () => {
        const today = new Date();
        const monthStart = startOfMonth(today);
        const monthEnd = endOfMonth(today);
        const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
        const startDay = getDay(monthStart); // 0 = Sun

        return (
            <div className="card">
                <h3>Consistency ({format(today, 'MMMM')})</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', marginTop: '1rem' }}>
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <span key={d} style={{ textAlign: 'center', color: '#666', fontSize: '0.8rem' }}>{d}</span>)}

                    {Array(startDay).fill(null).map((_, i) => <div key={`empty-${i}`} />)}

                    {days.map(day => {
                        const hasEntry = weights.some(w => isSameDay(new Date(w.date), day));
                        return (
                            <div key={day.toString()} style={{
                                aspectRatio: '1',
                                borderRadius: '50%',
                                background: hasEntry ? 'var(--accent)' : '#222',
                                color: hasEntry ? '#000' : '#666',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.8rem'
                            }}>
                                {format(day, 'd')}
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    };

    return (
        <div className="flex-col" style={{ paddingBottom: '2rem' }}>
            <div className="flex-row" style={{ marginBottom: '1rem' }}>
                <button onClick={onBack} style={{ padding: '0.5rem', background: 'transparent' }}><ChevronLeft /></button>
                <h2>Weight Tracker</h2>
            </div>

            <div className="card flex-row">
                <input
                    type="number"
                    placeholder="Weight (kg)"
                    value={weightInput}
                    onChange={(e) => setWeightInput(e.target.value)}
                    style={{ fontSize: '1.2rem', fontWeight: 'bold' }}
                />
                <button onClick={handleSave} style={{ background: 'var(--accent)', color: '#000' }}><Plus /></button>
            </div>

            <div className="card">
                <div className="flex-row" style={{ justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <h3>Progress</h3>
                    <div className="flex-row" style={{ gap: '4px' }}>
                        {['weekly', 'monthly', 'yearly'].map(m => (
                            <button
                                key={m}
                                onClick={() => setViewMode(m)}
                                style={{
                                    padding: '4px 8px',
                                    fontSize: '0.7rem',
                                    background: viewMode === m ? 'var(--accent)' : '#333',
                                    color: viewMode === m ? '#000' : '#fff'
                                }}
                            >
                                {m[0].toUpperCase() + m.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
                <div style={{ height: '200px' }}>
                    <Line options={{ maintainAspectRatio: false }} data={getChartData()} />
                </div>
            </div>

            <CalendarView />
        </div>
    );
};

export default WeighInView;
