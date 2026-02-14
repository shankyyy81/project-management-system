import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '1rem 2rem',
            backgroundColor: 'white',
            borderBottom: '1px solid #e2e8f0',
            marginBottom: '2rem'
        }}>
            <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                <Link to="/">SDG Project Manager</Link>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
                {user ? (
                    <>
                        <span>Welcome, {user.full_name} ({user.role})</span>
                        <Link to="/dashboard">Dashboard</Link>
                        {user.role === 'FACULTY' && (
                            <Link to="/project/new">Create Project</Link>
                        )}
                        <button onClick={logout} style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--error)',
                            cursor: 'pointer'
                        }}>
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
}
