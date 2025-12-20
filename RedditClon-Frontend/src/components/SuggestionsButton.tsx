import React, { useState } from 'react';
import SuggestionsForm from './SuggestionsForm';

const SuggestionsButton: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {isOpen && <SuggestionsForm onClose={() => setIsOpen(false)} />}
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    backgroundColor: 'var(--primary-color)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                    cursor: 'pointer',
                    zIndex: 1000,
                    fontSize: '1.5rem'
                }}
                title="Sugerencias y Consultas"
            >
                {isOpen ? '×' : '?'}
            </button>
        </>
    );
};

export default SuggestionsButton;
