import { useState } from 'react';
import { MUSCLE_GROUPS, saveWorkoutPlan, getWorkoutPlans } from '../utils/storage';
import { Save, Plus, Trash2 } from 'lucide-react';
import { nanoid } from 'nanoid';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const RoutinePlanner = () => {
    const [selectedDay, setSelectedDay] = useState('Monday');
    const [plans, setPlans] = useState(getWorkoutPlans());
    const [activePlan, setActivePlan] = useState(plans['Monday'] || { muscles: [], exercises: [] });

    // Update active plan when day changes
    const handleDayChange = (day) => {
        // Auto-save current day to local state before switching
        const updatedPlans = { ...plans, [selectedDay]: activePlan };
        setPlans(updatedPlans);

        setSelectedDay(day);
        setActivePlan(updatedPlans[day] || { muscles: [], exercises: [] });
    };

    const toggleMuscle = (muscle) => {
        const currentMuscles = activePlan.muscles || [];
        const newMuscles = currentMuscles.includes(muscle)
            ? currentMuscles.filter(m => m !== muscle)
            : [...currentMuscles, muscle];

        setActivePlan({ ...activePlan, muscles: newMuscles });
    };

    const addExercise = () => {
        setActivePlan({
            ...activePlan,
            exercises: [...(activePlan.exercises || []), { id: nanoid(), name: '' }]
        });
    };

    const updateExercise = (id, name) => {
        setActivePlan({
            ...activePlan,
            exercises: activePlan.exercises.map(e => e.id === id ? { ...e, name } : e)
        });
    };

    const removeExercise = (id) => {
        setActivePlan({
            ...activePlan,
            exercises: activePlan.exercises.filter(e => e.id !== id)
        });
    };

    const handleSave = () => {
        saveWorkoutPlan(selectedDay, activePlan);
        // Update local state to reflect saved status (could add visual feedback)
        setPlans({ ...plans, [selectedDay]: activePlan });
        alert(`Routine for ${selectedDay} saved!`);
    };

    return (
        <div className="flex-col" style={{ paddingBottom: '2rem' }}>
            <h2>Routine Planner</h2>

            {/* Day Selector */}
            <div className="flex-row" style={{ overflowX: 'auto', paddingBottom: '0.5rem' }}>
                {DAYS.map(day => (
                    <button
                        key={day}
                        onClick={() => handleDayChange(day)}
                        style={{
                            background: selectedDay === day ? 'var(--accent)' : '#333',
                            color: selectedDay === day ? '#000' : '#fff',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {day}
                    </button>
                ))}
            </div>

            <div className="card">
                <h3>Target Muscles</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '1rem' }}>
                    {MUSCLE_GROUPS.map(muscle => (
                        <button
                            key={muscle}
                            onClick={() => toggleMuscle(muscle)}
                            style={{
                                fontSize: '0.8rem',
                                padding: '4px 8px',
                                background: activePlan.muscles?.includes(muscle) ? 'var(--accent)' : '#222',
                                color: activePlan.muscles?.includes(muscle) ? '#000' : '#888',
                                border: '1px solid #444'
                            }}
                        >
                            {muscle}
                        </button>
                    ))}
                </div>
            </div>

            <div className="card">
                <h3>Exercises</h3>
                <div className="flex-col" style={{ gap: '0.5rem', marginTop: '1rem' }}>
                    {activePlan.exercises?.map((ex, i) => (
                        <div key={ex.id} className="flex-row">
                            <span className="text-secondary" style={{ width: '24px' }}>{i + 1}.</span>
                            <input
                                type="text"
                                placeholder="Exercise Name"
                                value={ex.name}
                                onChange={(e) => updateExercise(ex.id, e.target.value)}
                            />
                            <button onClick={() => removeExercise(ex.id)} style={{ padding: '0.5rem', background: 'transparent', color: 'var(--danger)' }}>
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                    <button onClick={addExercise} className="flex-row" style={{ justifyContent: 'center', border: '1px dashed var(--border)', background: 'transparent' }}>
                        <Plus size={16} /> Add Exercise
                    </button>
                </div>
            </div>

            <button onClick={handleSave} className="flex-row" style={{ justifyContent: 'center', background: 'var(--accent)', color: '#000', fontWeight: 'bold', padding: '1rem' }}>
                <Save size={20} /> Save Routine
            </button>
        </div>
    );
};

export default RoutinePlanner;
