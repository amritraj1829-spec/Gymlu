import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Signup = ({ onNavigate }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { signUp } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const { error } = await signUp({ email, password });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            // Supabase usually sends a confirmation email. 
            // For this implementation, we'll assume they can log in or are auto-logged in.
            alert('Check your email for the confirmation link!');
            onNavigate('login');
        }
    };

    return (
        <div className="flex-col" style={{ gap: 'var(--spacing-xl)', padding: 'var(--spacing-md)' }}>
            <div className="flex-col" style={{ gap: 'var(--spacing-sm)', alignItems: 'center' }}>
                <h1 className="accent">Gymlu</h1>
                <p className="text-secondary">Create your account</p>
            </div>

            <div className="card">
                <form onSubmit={handleSubmit} className="flex-col">
                    <div className="flex-col" style={{ gap: 'var(--spacing-sm)' }}>
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="you@example.com"
                        />
                    </div>

                    <div className="flex-col" style={{ gap: 'var(--spacing-sm)' }}>
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                        />
                    </div>

                    {error && <p style={{ color: 'var(--danger)', fontSize: '0.875rem' }}>{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            background: 'var(--accent)',
                            color: '#000',
                            fontWeight: '600',
                            marginTop: 'var(--spacing-md)'
                        }}
                    >
                        {loading ? 'Creating account...' : 'Sign Up'}
                    </button>
                </form>
            </div>

            <div style={{ textAlign: 'center' }}>
                <p className="text-secondary" style={{ fontSize: '0.875rem' }}>
                    Already have an account?{' '}
                    <button
                        onClick={() => onNavigate('login')}
                        style={{
                            background: 'transparent',
                            color: 'var(--accent)',
                            padding: 0,
                            fontSize: 'inherit',
                            textDecoration: 'underline'
                        }}
                    >
                        Login
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Signup;
