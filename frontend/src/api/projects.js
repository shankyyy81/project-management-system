import { fetchClient } from './client';

export const getMyProjects = async () => {
    const response = await fetchClient('/projects/my-projects');
    if (!response.ok) throw new Error('Failed to fetch projects');
    return response.json();
};

export const getMyProjectsView = async () => {
    const response = await fetchClient('/projects/my-projects-view');
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
        if (Array.isArray(err.detail)) {
            const msg = err.detail
                .map((d) => d.msg || d.message || JSON.stringify(d))
                .join(', ');
            throw new Error(msg || 'Failed to create project');
        }
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

export const assignStudents = async (projectId, payload) => {
    const response = await fetchClient(`/projects/${projectId}/assign`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
    });
    if (!response.ok) {
        const err = await response.json();
        if (Array.isArray(err.detail)) {
            const msg = err.detail
                .map((d) => d.msg || d.message || JSON.stringify(d))
                .join(', ');
            throw new Error(msg || 'Failed to assign students');
        }
        throw new Error(err.detail || 'Failed to assign students');
    }
    return response.json();
};

export const deleteProject = async (projectId) => {
    const response = await fetchClient(`/projects/${projectId}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        const err = await response.json();
        if (Array.isArray(err.detail)) {
            const msg = err.detail
                .map((d) => d.msg || d.message || JSON.stringify(d))
                .join(', ');
            throw new Error(msg || 'Failed to delete project');
        }
        throw new Error(err.detail || 'Failed to delete project');
    }
    return response.json();
};

export const getProjectWorkspace = async (projectId) => {
    const response = await fetchClient(`/projects/${projectId}/workspace`);
    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || 'Failed to fetch project workspace');
    }
    return response.json();
};

export const createProjectTask = async (projectId, payload) => {
    const response = await fetchClient(`/projects/${projectId}/tasks`, {
        method: 'POST',
        body: JSON.stringify(payload),
    });
    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || 'Failed to create task');
    }
    return response.json();
};

export const updateProjectTask = async (projectId, taskId, payload) => {
    const response = await fetchClient(`/projects/${projectId}/tasks/${taskId}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
    });
    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || 'Failed to update task');
    }
    return response.json();
};

export const getProjectChat = async (projectId) => {
    const response = await fetchClient(`/projects/${projectId}/chat`);
    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || 'Failed to fetch chat messages');
    }
    return response.json();
};

export const postProjectChat = async (projectId, payload) => {
    const response = await fetchClient(`/projects/${projectId}/chat`, {
        method: 'POST',
        body: JSON.stringify(payload),
    });
    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || 'Failed to send message');
    }
    return response.json();
};

// ── Attachments ──────────────────────────────────────────────

const API_URL = 'http://localhost:8000';

export const uploadAttachment = async (projectId, taskId, file) => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(
        `${API_URL}/projects/${projectId}/tasks/${taskId}/attachments`,
        {
            method: 'POST',
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            body: formData,
        }
    );
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || 'Upload failed');
    }
    return response.json();
};

export const deleteAttachment = async (projectId, taskId, attachmentId) => {
    const response = await fetchClient(
        `/projects/${projectId}/tasks/${taskId}/attachments/${attachmentId}`,
        { method: 'DELETE' }
    );
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || 'Delete failed');
    }
    return response.json();
};

export const downloadAttachment = async (projectId, taskId, attachmentId, originalName) => {
    const token = localStorage.getItem('token');
    const response = await fetch(
        `${API_URL}/projects/${projectId}/tasks/${taskId}/attachments/${attachmentId}`,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    if (!response.ok) throw new Error('Download failed');
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = originalName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};
