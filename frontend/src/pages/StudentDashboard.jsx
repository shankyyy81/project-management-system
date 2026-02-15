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

    if (loading) return <div className="text-center mt-8">Loading assigned projects...</div>;

    return (
        <div>
            <h2>My Assigned Projects</h2>

            {projects.length === 0 ? (
                <div className="text-center mt-4 text-muted">
                    <p>You have not been assigned to any projects yet. Please contact a Faculty member.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 grid-cols-2 grid-cols-3 mt-4">
                    {projects.map(project => (
                        <div key={project._id} className="card card-hover" style={{ borderLeft: '4px solid var(--primary)' }}>
                            <h3>{project.title}</h3>
                            <p><strong>Faculty:</strong> {project.faculty.id}</p>
                            <div className="mt-2 text-muted">
                                <strong>Role:</strong> Project Member
                            </div>
                            <div className="mt-2">
                                <strong>SDGs:</strong>
                                <span className="ml-2">{Object.values(project.sdg_mapping).join(', ')}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
