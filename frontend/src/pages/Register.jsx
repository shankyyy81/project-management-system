import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        full_name: '',
        role: 'STUDENT',
        department: '',
        year: '',
        skills: '',
        interests: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Construct payload matching backend schema
        const payload = {
            email: formData.email,
            password: formData.password,
            full_name: formData.full_name,
            role: formData.role,
        };

        if (formData.role === 'FACULTY') {
            payload.faculty_profile = {
                department: formData.department,
                interests: formData.interests.split(',').map(s => s.trim())
            };
        } else {
            payload.student_profile = {
                department: formData.department,
                year: formData.year,
                skills: formData.skills.split(',').map(s => s.trim())
            };
        }

        try {
            const response = await fetch('http://localhost:8000/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                navigate('/login');
            } else {
                const err = await response.json();
                alert(err.detail || 'Registration failed');
            }
        } catch (error) {
            console.error(error);
            alert('Network error');
        }
    };

    return (
        <div style={{ maxWidth: '500px', margin: '2rem auto', padding: '2rem', backgroundColor: 'white', borderRadius: '8px', boxShadow: 'var(--box-shadow)' }}>
            <h2>Register</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input name="full_name" placeholder="Full Name" onChange={handleChange} required style={{ padding: '0.5rem' }} />
                <input name="email" type="email" placeholder="Email" onChange={handleChange} required style={{ padding: '0.5rem' }} />
                <input name="password" type="password" placeholder="Password" onChange={handleChange} required style={{ padding: '0.5rem' }} />

                <select name="role" onChange={handleChange} value={formData.role} style={{ padding: '0.5rem' }}>
                    <option value="STUDENT">Student</option>
                    <option value="FACULTY">Faculty</option>
                </select>

                <input name="department" placeholder="Department" onChange={handleChange} required style={{ padding: '0.5rem' }} />

                {formData.role === 'FACULTY' ? (
                    <input name="interests" placeholder="Interests (comma separated)" onChange={handleChange} style={{ padding: '0.5rem' }} />
                ) : (
                    <>
                        <input name="year" placeholder="Year" onChange={handleChange} required style={{ padding: '0.5rem' }} />
                        <input name="skills" placeholder="Skills (comma separated)" onChange={handleChange} style={{ padding: '0.5rem' }} />
                    </>
                )}

                <button type="submit" style={{ padding: '0.5rem', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '4px' }}>
                    Register
                </button>
            </form>
        </div>
    );
}
