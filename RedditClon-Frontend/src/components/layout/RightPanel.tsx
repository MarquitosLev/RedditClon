import React from 'react';

const RightPanel: React.FC = () => {
    return (
        <aside style={{
            width: '312px',
            display: window.innerWidth < 1000 ? 'none' : 'block',
            paddingTop: '20px'
        }}>
            {/* Community Info Card */}
            <div style={{
                backgroundColor: 'var(--card-bg)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '16px',
                overflow: 'hidden'
            }}>
                <div style={{
                    backgroundColor: 'var(--primary-color)',
                    height: '34px',
                    padding: '12px',
                    color: 'white',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    Acerca de la comunidad
                </div>
                <div style={{ padding: '12px' }}>
                    <div style={{ marginBottom: '12px', fontSize: '14px', lineHeight: '10px' }}>
                        <p> Bienvenido a RedditClon, el lugar donde la gente se reúne para tener las conversaciones más auténticas e interesantes de internet.</p>
                    </div>

                    <div style={{
                        display: 'flex',
                        borderBottom: '1px solid var(--line-color)',
                        paddingBottom: '16px',
                        marginBottom: '16px'
                    }}>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '16px', fontWeight: 'bold' }}>1.2m</div>
                            <div style={{ fontSize: '12px', color: 'var(--meta-text)' }}>Miembros</div>
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '16px', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                                <span style={{ width: '8px', height: '8px', backgroundColor: 'var(--success-color)', borderRadius: '50%', marginRight: '4px' }}></span>
                                450
                            </div>
                            <div style={{ fontSize: '12px', color: 'var(--meta-text)' }}>Online</div>
                        </div>
                    </div>

                    <button style={{
                        width: '100%',
                        backgroundColor: 'var(--button-bg)',
                        color: 'var(--button-text)',
                        padding: '8px 16px',
                        borderRadius: 'var(--radius-pill)',
                        fontSize: '14px'
                    }}>
                        Crear Post
                    </button>

                    <button style={{
                        width: '100%',
                        backgroundColor: 'transparent',
                        color: 'var(--button-bg)',
                        border: '1px solid var(--button-bg)',
                        padding: '8px 16px',
                        borderRadius: 'var(--radius-pill)',
                        fontSize: '14px',
                        marginTop: '8px'
                    }}>
                        Crear Comunidad
                    </button>
                </div>
            </div>

            {/* Footer Rules / Links */}
            <div style={{
                backgroundColor: 'var(--card-bg)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '12px'
            }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    <FooterLink label="Reglas" />
                    <FooterLink label="Política de Privacidad" />
                    <FooterLink label="Términos" />
                </div>
                <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--meta-text)' }}>
                    RedditClon Inc © 2025. Todos los derechos reservados.
                </div>
            </div>
        </aside>
    );
};

const FooterLink: React.FC<{ label: string }> = ({ label }) => (
    <span style={{ fontSize: '12px', color: 'var(--text-secondary)', cursor: 'pointer', textDecoration: 'underline' }}>
        {label}
    </span>
);

export default RightPanel;
