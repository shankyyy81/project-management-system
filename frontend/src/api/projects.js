import { fetchClient } from './client';

export const getMyProjects = async () => {
    const response = await fetchClient('/projects/my-projects');
    if (!response.ok) throw new Error('Failed to fetch projects');
    return response.json();
};

export const createProject = async (projectData) => {
    const response = await fetchClient('/projects/', {
        method: 'POST',
        body: JSON.stringify(projectData),
    });
    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || 'Failed to create project');
    }
    return response.json();
};

export const analyzeSDG = async (problemStatement) => {
    const response = await fetchClient('/ml/analyze', {
        method: 'POST',
        body: JSON.stringify({ problem_statement: problemStatement }),
    });
    if (!response.ok) throw new Error('Analysis failed');
    return response.json();
};
