import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import MainNav from './components/MainNav';
import NotFound from './pages/NotFound';
import LocationFinder from './pages/LocationFinder';
import GlobalErrorNotification from './components/GlobalErrorNotification';
import { ErrorProvider } from './contexts/ErrorContext';
//TODO: Implement this haversine equation for checking distance between lat longs
// function distance(lat1, lon1, lat2, lon2) {
//   const r = 6371; // km
//   const p = Math.PI / 180;

//   const a = 0.5 - Math.cos((lat2 - lat1) * p) / 2
//                 + Math.cos(lat1 * p) * Math.cos(lat2 * p) *
//                   (1 - Math.cos((lon2 - lon1) * p)) / 2;

//   return 2 * r * Math.asin(Math.sqrt(a));
// }
// TODO: better error handling in forms and init functions
//TODO: analyze and understand how our service worker is doing what its doing
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
        // <div className='bg-neutral-900 text-neutral-200 px-2'>
        //     <MainNav user={user} setSignInFormVisible={setSignInFormVisible} signInFormVisible={signInFormVisible} />
        //     {signInFormVisible ? (
        //         <SignIn setSignInFormVisible={setSignInFormVisible} />
        //     ) : null}
        //     <ImageUploader />
        //     <NewLocationGenerator />
        //     {isMobileDevice ? <div>Hey mobile</div> : <div>Not Mobile Haha</div>}
        // </div>
    );
};

export default App;
