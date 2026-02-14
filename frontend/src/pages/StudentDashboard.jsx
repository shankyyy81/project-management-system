import { useEffect, useState } from 'react';
import { getMyProjects } from '../api/projects';

export default function StudentDashboard() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        try {
            const data = await getMyProjects();
            setProjects(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading assigned projects...</div>;

    return (
        <div>
            <h2>My Assigned Projects</h2>

            {projects.length === 0 ? (
                <p style={{ color: 'var(--secondary-color)', marginTop: '1rem' }}>
                    You have not been assigned to any projects yet. Please contact a Faculty member.
                </p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                    {projects.map(project => (
                        <div key={project._id} style={{
                            padding: '1rem',
                            backgroundColor: 'white',
                            borderRadius: '8px',
                            boxShadow: 'var(--box-shadow)',
                            borderLeft: '4px solid var(--primary-color)'
                        }}>
                            <h3>{project.title}</h3>
                            <p><strong>Faculty:</strong> {project.faculty.id /* In real app, populate this */}</p>
                            <div style={{ marginTop: '0.5rem' }}>
                                <strong>Role:</strong> {project.team.leader.id /* check if self */ ? 'Team Member' : 'Member'}
                            </div>
                            <div style={{ marginTop: '1rem' }}>
                                <strong>SDGs:</strong> {Object.values(project.sdg_mapping).join(', ')}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
