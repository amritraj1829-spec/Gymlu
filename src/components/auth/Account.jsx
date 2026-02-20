import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, Mail, Shield, LogOut, ChevronLeft } from 'lucide-react';

const Account = ({ onBack }) => {
    const { user, signOut, updateProfile } = useAuth();
    const [displayName, setDisplayName] = useState(user?.user_metadata?.display_name || '');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const { error } = await updateProfile({
            data: { display_name: displayName }
        });

        if (error) {
            setMessage({ type: 'error', text: error.message });
        } else {
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        }
        setLoading(false);
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const { error } = await updateProfile({ password: newPassword });

        if (error) {
            setMessage({ type: 'error', text: error.message });
        } else {
            setMessage({ type: 'success', text: 'Password changed successfully!' });
            setNewPassword('');
        }
        setLoading(false);
    };

    return (
        <div className="flex-col" style={{ gap: 'var(--spacing-lg)' }}>
            <header className="flex-row" style={{ justifyContent: 'space-between' }}>
                <button onClick={onBack} style={{ background: 'transparent', padding: '4px' }}>
                    <ChevronLeft size={24} />
                </button>
                <h2 style={{ flex: 1, textAlign: 'center', marginRight: '32px' }}>Account Settings</h2>
            </header>

            {message && (
                <div className="card" style={{
                    background: message.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(74, 222, 128, 0.1)',
                    border: `1px solid ${message.type === 'error' ? 'var(--danger)' : 'var(--accent)'}`,
                    color: message.type === 'error' ? 'var(--danger)' : 'var(--accent)'
                }}>
                    {message.text}
                </div>
            )}

            <section className="flex-col" style={{ gap: 'var(--spacing-md)' }}>
                <div className="card flex-row" style={{ gap: 'var(--spacing-md)' }}>
                    <div style={{ background: 'var(--bg-primary)', padding: '12px', borderRadius: '50%' }}>
                        <Mail size={20} className="text-secondary" />
                    </div>
                    <div className="flex-col" style={{ gap: '2px' }}>
                        <span className="text-secondary" style={{ fontSize: '0.75rem' }}>Email Address</span>
                        <span>{user?.email}</span>
                    </div>
                </div>

                <div className="card">
                    <form onSubmit={handleUpdateProfile} className="flex-col">
                        <div className="flex-row" style={{ gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-sm)' }}>
                            <User size={18} className="accent" />
                            <h3>Update Profile</h3>
                        </div>

                        <div className="flex-col" style={{ gap: '4px' }}>
                            <label htmlFor="displayName" style={{ fontSize: '0.875rem' }} className="text-secondary">Display Name</label>
                            <input
                                id="displayName"
                                type="text"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                placeholder="Your name"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{ background: 'var(--accent)', color: '#000', fontWeight: '500' }}
                        >
                            Save Changes
                        </button>
                    </form>
                </div>

                <div className="card">
                    <form onSubmit={handleChangePassword} className="flex-col">
                        <div className="flex-row" style={{ gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-sm)' }}>
                            <Shield size={18} className="accent" />
                            <h3>Security</h3>
                        </div>

                        <div className="flex-col" style={{ gap: '4px' }}>
                            <label htmlFor="newPassword" style={{ fontSize: '0.875rem' }} className="text-secondary">Change Password</label>
                            <input
                                id="newPassword"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="New password"
                                minLength={6}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !newPassword}
                            style={{ border: '1px solid var(--border)', background: 'transparent' }}
                        >
                            Update Password
                        </button>
                    </form>
                </div>

                <button
                    onClick={() => signOut()}
                    className="flex-row"
                    style={{
                        justifyContent: 'center',
                        background: 'rgba(239, 68, 68, 0.1)',
                        color: 'var(--danger)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        marginTop: 'var(--spacing-lg)'
                    }}
                >
                    <LogOut size={18} />
                    <span>Logout</span>
                </button>
            </section>
        </div>
    );
};

export default Account;
