import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => {
    return (
        <aside style={{
            width: 'var(--sidebar-width)',
            height: 'calc(100vh - var(--navbar-height))',
            position: 'sticky',
            top: 'var(--navbar-height)',
            padding: '16px 0',
            borderRight: '1px solid var(--line-color)',
            overflowY: 'auto',
            display: window.innerWidth < 1000 ? 'none' : 'block' // Hide on smaller screens
        }}>
            <div style={{ padding: '0 16px 16px', borderBottom: '1px solid var(--line-color)', marginBottom: '16px' }}>
                <SectionHeader title="FEEDS" />
                <SidebarLink to="/" icon="🏠" label="Inicio" />
                <SidebarLink to="/popular" icon="🔥" label="Popular" />
                <SidebarLink to="/wall-of-fame" icon="🏆" label="Wall of Fame" />
            </div>

            <div style={{ padding: '0 16px' }}>
                <SectionHeader title="COMUNIDADES RECIENTES" />
                <SidebarLink to="/r/programacion" icon="💻" label="r/programacion" />
                <SidebarLink to="/r/argentina" icon="🌞" label="r/argentina" />
                <SidebarLink to="/r/webdev" icon="🌐" label="r/webdev" />
                <SidebarLink to="/r/memes" icon="🐸" label="r/memes" />

                <div style={{ height: '20px' }} />

                <SectionHeader title="RECURSOS" />
                <SidebarLink to="/about" icon="ℹ️" label="Acerca de RedditClon" />
                <SidebarLink to="/help" icon="❓" label="Ayuda" />
                <SidebarLink to="/blog" icon="📝" label="Blog" />
                <SidebarLink to="/careers" icon="💼" label="Trabajos" />
            </div>
        </aside>
    );
};

const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
    <div style={{
        fontSize: '10px',
        fontWeight: 'bold',
        color: 'var(--meta-text)',
        marginBottom: '8px',
        paddingLeft: '8px'
    }}>
        {title}
    </div>
);

const SidebarLink: React.FC<{ to: string, icon: string, label: string }> = ({ to, icon, label }) => (
    <Link to={to} style={{
        display: 'flex',
        alignItems: 'center',
        padding: '8px',
        borderRadius: 'var(--radius-sm)',
        color: 'var(--text-color)',
        textDecoration: 'none',
        marginBottom: '2px',
        transition: 'background-color 0.1s'
    }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'var(--line-color)')}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
    >
        <span style={{ marginRight: '12px', fontSize: '20px' }}>{icon}</span>
        <span style={{ fontSize: '14px' }}>{label}</span>
    </Link>
);

export default Sidebar;
