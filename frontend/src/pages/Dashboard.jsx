import { useAuth } from '../context/AuthContext';
import FacultyDashboard from './FacultyDashboard';
import StudentDashboard from './StudentDashboard';

export default function Dashboard() {
    const { user } = useAuth();

    if (!user) return null;

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Dashboard</h1>
            {user.role === 'FACULTY' ? (
                <FacultyDashboard />
            ) : (
                <StudentDashboard />
            )}
        </div>
    );
}
