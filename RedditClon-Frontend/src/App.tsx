import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ThemeToggle from './components/ThemeToggle';
import AppContent from './AppContent';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
        <ThemeToggle />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
