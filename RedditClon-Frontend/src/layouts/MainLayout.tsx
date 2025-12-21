import React from 'react';
import Navbar from '../components/layout/Navbar';

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <div style={{ backgroundColor: 'var(--canvas)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />

            <div style={{
                maxWidth: '100%',
                display: 'flex',
                justifyContent: 'center'
            }}>
                <div style={{
                    display: 'flex',
                    width: '100%',
                    maxWidth: '900px', // Slightly narrower for single column read
                    padding: '20px 24px',
                }}>
                    {/* Main Content Feed - Center */}
                    <main style={{
                        flex: 1,
                        minWidth: 0,
                        maxWidth: '100%'
                    }}>
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default MainLayout;
