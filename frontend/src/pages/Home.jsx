import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
            <h1>Welcome to the SDG Project Manager</h1>
            <p style={{ maxWidth: '600px', margin: '1rem auto' }}>
                A generic, effective platform for managing academic social good projects aligned with United Nations Sustainable Development Goals.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
                <Link to="/login" style={{ padding: '0.75rem 1.5rem', backgroundColor: 'var(--primary-color)', color: 'white', borderRadius: '4px' }}>
                    Login
                </Link>
                <Link to="/register" style={{ padding: '0.75rem 1.5rem', backgroundColor: 'white', border: '1px solid var(--primary-color)', color: 'var(--primary-color)', borderRadius: '4px' }}>
                    Register
                </Link>
            </div>
        </div>
    );
}
