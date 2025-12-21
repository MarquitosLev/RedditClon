import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import ThemeToggle from '../ThemeToggle';

const Navbar: React.FC = () => {
    const { authState, logout } = useAuth();
    const { user } = authState;
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <nav style={{
            height: 'var(--navbar-height)',
            width: '100%',
            boxSizing: 'border-box',
            backgroundColor: 'var(--bg-color)',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 20px',
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            justifyContent: 'space-between'
        }}>
            {/* Logo Section */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                    <div style={{
                        width: '32px',
                        height: '32px',
                        backgroundColor: 'var(--primary-color)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold'
                    }}>
                        r/
                    </div>
                    <span style={{
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: 'var(--text-color)',
                    }}>
                        redditclon
                    </span>
                </Link>
            </div>

            {/* Spacer */}
            <div style={{ flex: 1 }}></div>

            {/* User Actions - Right */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <ThemeToggle />

                {user ? (
                    <div style={{ position: 'relative' }} ref={dropdownRef}>
                        <div
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                border: '1px solid transparent',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                userSelect: 'none'
                            }}
                            onMouseOver={(e) => (e.currentTarget.style.border = '1px solid var(--border-color)')}
                            onMouseOut={(e) => (!isDropdownOpen && (e.currentTarget.style.border = '1px solid transparent'))}
                        >
                            <div style={{
                                width: '24px',
                                height: '24px',
                                backgroundColor: 'var(--input-border)',
                                borderRadius: '4px'
                            }}>
                                {/* User Avatar Placeholder */}
                                <img
                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                                    alt="avatar"
                                    style={{ width: '100%', height: '100%', borderRadius: '4px' }}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-color)' }}>
                                    {user.username}
                                </span>
                                <span style={{ fontSize: '10px', color: 'var(--meta-text)' }}>
                                    {user.isAdmin ? 'Admin' : 'Usuario'}
                                </span>
                            </div>
                            <span style={{ fontSize: '12px', color: 'var(--text-color)' }}>▼</span>
                        </div>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div style={{
                                position: 'absolute',
                                top: '100%',
                                right: 0,
                                marginTop: '8px',
                                width: '200px',
                                backgroundColor: 'var(--card-bg)',
                                border: '1px solid var(--border-color)',
                                borderRadius: 'var(--radius-md)',
                                boxShadow: '0 4px 12px var(--shadow-sm)',
                                zIndex: 1001,
                                overflow: 'hidden',
                                padding: '8px 0'
                            }}>
                                {user.isAdmin && (
                                    <>
                                        <div style={{
                                            padding: '8px 16px',
                                            fontSize: '10px',
                                            fontWeight: 'bold',
                                            color: 'var(--meta-text)',
                                            textTransform: 'uppercase'
                                        }}>
                                            Administrador
                                        </div>
                                        <Link to="/admin/dashboard"
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                padding: '10px 16px',
                                                color: 'var(--text-color)',
                                                textDecoration: 'none',
                                                fontSize: '14px'
                                            }}
                                            onMouseOver={(e) => ((e.target as HTMLElement).style.backgroundColor = 'var(--input-bg)')}
                                            onMouseOut={(e) => ((e.target as HTMLElement).style.backgroundColor = 'transparent')}
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            📊 Dashboard Usuarios
                                        </Link>

                                        <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '8px 0' }}></div>
                                    </>
                                )}
                                <div
                                    onClick={handleLogout}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '10px 16px',
                                        color: 'var(--text-color)',
                                        cursor: 'pointer',
                                        fontSize: '14px'
                                    }}
                                    onMouseOver={(e) => ((e.target as HTMLElement).style.backgroundColor = 'var(--input-bg)')}
                                    onMouseOut={(e) => ((e.target as HTMLElement).style.backgroundColor = 'transparent')}
                                >
                                    🚪 Cerrar Sesión
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link to="/login" style={{
                        backgroundColor: 'var(--primary-color)',
                        color: 'white',
                        padding: '6px 20px',
                        borderRadius: 'var(--radius-pill)',
                        fontWeight: 'bold',
                        fontSize: '14px'
                    }}>
                        Log In
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
