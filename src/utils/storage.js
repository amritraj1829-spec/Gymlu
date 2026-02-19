const STORAGE_KEYS = {
    WORKOUTS: 'gymlu_workouts',
    BODY_WEIGHT: 'gymlu_body_weight',
    PLANS: 'gymlu_plans',
};

// --- Workouts ---
export const getWorkouts = () => {
    const data = localStorage.getItem(STORAGE_KEYS.WORKOUTS);
    return data ? JSON.parse(data) : [];
};

export const saveWorkout = (workout) => {
    const workouts = getWorkouts();
    workouts.push(workout);
    localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(workouts));
};

// --- Body Weight ---
export const getBodyWeights = () => {
    const data = localStorage.getItem(STORAGE_KEYS.BODY_WEIGHT);
    return data ? JSON.parse(data) : [];
};

export const saveBodyWeight = (entry) => {
    const weights = getBodyWeights();
    weights.push(entry);
    localStorage.setItem(STORAGE_KEYS.BODY_WEIGHT, JSON.stringify(weights));
};

// --- Workout Plans ---
export const getWorkoutPlans = () => {
    const data = localStorage.getItem(STORAGE_KEYS.PLANS);
    return data ? JSON.parse(data) : {};
};

export const saveWorkoutPlan = (day, plan) => {
    const plans = getWorkoutPlans();
    plans[day] = plan;
    localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(plans));
};

// --- History & Analytics Helper ---
export const getExerciseHistory = (exerciseName) => {
    const workouts = getWorkouts();
    const history = [];
    workouts.forEach(w => {
        const exercise = w.exercises.find(e => e.name === exerciseName);
        if (exercise) {
            history.push({
                date: w.endTime || w.startTime,
                sets: exercise.sets,
                workoutId: w.id
            });
        }
    });
    return history.sort((a, b) => new Date(b.date) - new Date(a.date)); // Newest first
};

export const getLastSessionStats = (exerciseName) => {
    const history = getExerciseHistory(exerciseName);
    return history.length > 0 ? history[0] : null;
};

// --- Muscle Groups Data ---
export const MUSCLE_GROUPS = [
    'Biceps', 'Triceps', 'Forearms', 'Shoulders', 'Chest', 'Back', 'Legs', 'Abs', 'Neck'
];

export const clearData = () => {
    localStorage.removeItem(STORAGE_KEYS.WORKOUTS);
    localStorage.removeItem(STORAGE_KEYS.BODY_WEIGHT);
    localStorage.removeItem(STORAGE_KEYS.PLANS);
}
