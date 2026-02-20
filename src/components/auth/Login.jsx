import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Login = ({ onNavigate }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { signIn } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const { error } = await signIn({ email, password });

        if (error) {
            setError(error.message);
            setLoading(false);
        }
        // Redirect happens automatically via AuthContext/App.jsx listener
    };

    return (
        <div className="flex-col" style={{ gap: 'var(--spacing-xl)', padding: 'var(--spacing-md)' }}>
            <div className="flex-col" style={{ gap: 'var(--spacing-sm)', alignItems: 'center' }}>
                <h1 className="accent">Gymlu</h1>
                <p className="text-secondary">Welcome back!</p>
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
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>

            <div style={{ textAlign: 'center' }}>
                <p className="text-secondary" style={{ fontSize: '0.875rem' }}>
                    Don't have an account?{' '}
                    <button
                        onClick={() => onNavigate('signup')}
                        style={{
                            background: 'transparent',
                            color: 'var(--accent)',
                            padding: 0,
                            fontSize: 'inherit',
                            textDecoration: 'underline'
                        }}
                    >
                        Sign up
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Login;
