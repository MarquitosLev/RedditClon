import React, { useState } from 'react';
import axios from 'axios';

interface SuggestionsFormProps {
    onClose: () => void;
}

const SuggestionsForm: React.FC<SuggestionsFormProps> = ({ onClose }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        setError(null);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        if (file) {
            formData.append('file', file);
        }

        try {
            await axios.post('http://localhost:8080/api/feedback', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            });
            setMessage('Sugerencia enviada con éxito. ¡Gracias!');
            setTitle('');
            setDescription('');
            setFile(null);
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (err) {
            console.error(err);
            setError('Error al enviar la sugerencia. Por favor, inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: '80px',
            right: '20px',
            width: '300px',
            backgroundColor: 'var(--card-bg)',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 1000,
            border: '1px solid var(--border-color)'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-color)' }}>Sugerencias</h3>
                <button
                    onClick={onClose}
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '1.2rem',
                        color: 'var(--text-muted)'
                    }}
                >
                    &times;
                </button>
            </div>

            {message && <div style={{ color: 'green', marginBottom: '10px', fontSize: '0.9rem' }}>{message}</div>}
            {error && <div style={{ color: 'red', marginBottom: '10px', fontSize: '0.9rem' }}>{error}</div>}

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: 'var(--text-color)' }}>Título</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        style={{
                            width: '100%',
                            padding: '8px',
                            borderRadius: '4px',
                            border: '1px solid var(--border-color)',
                            backgroundColor: 'var(--bg-color)',
                            color: 'var(--text-color)'
                        }}
                    />
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: 'var(--text-color)' }}>Descripción</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        rows={4}
                        style={{
                            width: '100%',
                            padding: '8px',
                            borderRadius: '4px',
                            border: '1px solid var(--border-color)',
                            backgroundColor: 'var(--bg-color)',
                            color: 'var(--text-color)',
                            resize: 'vertical'
                        }}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: 'var(--text-color)' }}>Adjuntar archivo (opcional)</label>
                    <input
                        type="file"
                        onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                        style={{
                            width: '100%',
                            fontSize: '0.9rem',
                            color: 'var(--text-muted)'
                        }}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '10px',
                        backgroundColor: 'var(--primary-color)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.7 : 1
                    }}
                >
                    {loading ? 'Enviando...' : 'Enviar Sugerencia'}
                </button>
            </form>
        </div>
    );
};

export default SuggestionsForm;
