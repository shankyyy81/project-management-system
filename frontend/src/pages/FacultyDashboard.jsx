import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyProjects } from '../api/projects';

export default function FacultyDashboard() {
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

    const activeProjectsCount = projects.filter(p => p.status !== 'Completed').length;

    if (loading) return <div>Loading projects...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2>My Projects ({activeProjectsCount}/5 Active)</h2>
                {activeProjectsCount < 5 ? (
                    <Link to="/project/new" className="button" style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: 'var(--primary-color)',
                        color: 'white',
                        borderRadius: '4px',
                        textDecoration: 'none'
                    }}>
                        Create New Project
                    </Link>
                ) : (
                    <span style={{ color: 'var(--secondary-color)' }}>Max projects reached</span>
                )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                {projects.map(project => (
                    <div key={project._id} style={{
                        padding: '1rem',
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        boxShadow: 'var(--box-shadow)',
                        borderLeft: `4px solid ${project.status === 'Completed' ? 'var(--success)' : 'var(--primary-color)'}`
                    }}>
                        <h3>{project.title}</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--secondary-color)' }}>Status: {project.status}</p>
                        <div style={{ marginTop: '0.5rem' }}>
                            <strong>SDGs:</strong>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                                {Object.values(project.sdg_mapping).map((sdg, idx) => (
                                    <span key={idx} style={{
                                        fontSize: '0.8rem',
                                        backgroundColor: '#e0f2fe',
                                        color: '#0369a1',
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '12px'
                                    }}>
                                        {sdg}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {projects.length === 0 && (
                <p style={{ textAlign: 'center', color: 'var(--secondary-color)', marginTop: '2rem' }}>
                    No projects found. Start by creating one!
                </p>
            )}
        </div>
    );
}
