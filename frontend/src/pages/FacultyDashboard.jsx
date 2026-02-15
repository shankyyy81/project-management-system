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

    if (loading) return <div className="text-center mt-8">Loading projects...</div>;

    return (
        <div>
            <div className="flex-center justify-between mb-4">
                <h2>My Projects ({activeProjectsCount}/5 Active)</h2>
                {activeProjectsCount < 5 ? (
                    <Link to="/project/new" className="btn btn-primary">
                        Create New Project
                    </Link>
                ) : (
                    <span className="text-muted">Max projects reached</span>
                )}
            </div>

            <div className="grid grid-cols-1 grid-cols-2 grid-cols-3">
                {projects.map(project => (
                    <div key={project._id} className="card card-hover" style={{
                        borderLeft: `4px solid ${project.status === 'Completed' ? 'var(--success)' : 'var(--primary)'}`
                    }}>
                        <h3>{project.title}</h3>
                        <p className="text-muted" style={{ fontSize: '0.9rem' }}>Status: {project.status}</p>
                        <div className="mt-2">
                            <strong>SDGs:</strong>
                            <div className="d-flex gap-2 mt-1" style={{ flexWrap: 'wrap' }}>
                                {Object.values(project.sdg_mapping).map((sdg, idx) => (
                                    <span key={idx} style={{
                                        fontSize: '0.8rem',
                                        backgroundColor: 'var(--primary-light)',
                                        color: 'var(--primary-hover)',
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
                <div className="text-center mt-8 text-muted">
                    <p>No projects found. Start by creating one!</p>
                </div>
            )}
        </div>
    );
}
