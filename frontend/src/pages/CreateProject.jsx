import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProject, analyzeSDG } from '../api/projects';

export default function CreateProject() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        title: '',
        problem_statement: '',
        sdg_mapping: {}
    });
    const [analysisResults, setAnalysisResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleAnalyze = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await analyzeSDG(formData.problem_statement);
            setAnalysisResults(data.suggestions);
            setStep(2);
        } catch (err) {
            setError('Analysis failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = async (selectedSuggestion) => {
        const finalData = {
            title: formData.title,
            problem_statement: formData.problem_statement,
            sdg_mapping: { [selectedSuggestion.sdg]: selectedSuggestion.sdg }, // Simplified mapping
            ml_confidence_scores: { [selectedSuggestion.sdg]: selectedSuggestion.confidence }
        };

        try {
            await createProject(finalData);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Failed to create project');
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '2rem', backgroundColor: 'white', borderRadius: '8px', boxShadow: 'var(--box-shadow)' }}>
            <h2>Create New Project</h2>
            {error && <p style={{ color: 'var(--error)' }}>{error}</p>}

            {step === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Project Title</label>
                        <input
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            style={{ width: '100%', padding: '0.5rem' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Problem Statement</label>
                        <textarea
                            value={formData.problem_statement}
                            onChange={(e) => setFormData({ ...formData, problem_statement: e.target.value })}
                            rows={6}
                            style={{ width: '100%', padding: '0.5rem' }}
                        />
                    </div>
                    <button
                        onClick={handleAnalyze}
                        disabled={!formData.title || !formData.problem_statement || loading}
                        style={{
                            padding: '0.75rem',
                            backgroundColor: 'var(--primary-color)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            opacity: loading ? 0.7 : 1
                        }}
                    >
                        {loading ? 'Analyzing with SDG-BERT...' : 'Analyze for SDG Alignment'}
                    </button>
                </div>
            )}

            {step === 2 && analysisResults && (
                <div>
                    <h3>AI Analysis Results</h3>
                    <p>The system suggests the following SDGs based on your problem statement:</p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                        {analysisResults.map((suggestion, idx) => (
                            <div key={idx} style={{
                                padding: '1rem',
                                border: '1px solid #e2e8f0',
                                borderRadius: '4px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div>
                                    <strong>{suggestion.sdg}</strong>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--secondary-color)' }}>
                                        Confidence: {(suggestion.confidence * 100).toFixed(1)}%
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleConfirm(suggestion)}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        backgroundColor: 'var(--success)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px'
                                    }}
                                >
                                    Confirm & Create
                                </button>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => setStep(1)}
                        style={{ marginTop: '1rem', background: 'none', border: 'none', color: 'var(--secondary-color)', cursor: 'pointer' }}
                    >
                        Back to Edit
                    </button>
                </div>
            )}
        </div>
    );
}
