import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import MainNav from './components/MainNav';
import NotFound from './pages/NotFound';
import LocationFinder from './pages/LocationFinder';
import GlobalErrorNotification from './components/GlobalErrorNotification';
import { ErrorProvider } from './contexts/ErrorContext';

const App: React.FC = () => {
    return (
        <Router>
            <ErrorProvider>
                <MainNav />
                <GlobalErrorNotification />
                <Routes>
                    <Route path="/" element={<LocationFinder />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </ErrorProvider>
        </Router>
    );
};

export default App;
