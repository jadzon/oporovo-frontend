// App.jsx
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser } from './store/thunks/authThunks';

// Components
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
// import Dashboard from './pages/Dashboard';
import AuthCallback from './components/auth/AuthCallback';
import { ROUTES } from './api/constants';
import CockpitPage from "./pages/CockpitPage.jsx";
import TutorsPage from "./pages/TutorsPage.jsx";
import HelpPage from "./pages/HelpPage.jsx";
import CoursesPage from "./pages/CoursesPage.jsx";
import {LayoutGroup} from "framer-motion";

// Protected route component
const ProtectedRoute = ({ children }) => {
    const isAuthenticated = useSelector(state => !!state.auth.user);

    if (!isAuthenticated) {
        return <Navigate to={ROUTES.HOME} replace />;
    }

    return children;
};

function App() {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state) => !!state.auth.user);

    useEffect(() => {
        try {
            dispatch(getCurrentUser());
        } catch (error) {
            console.error("Error dispatching getCurrentUser:", error);
        }
    }, [dispatch]);

    return (
        <BrowserRouter>
            <Routes>
                <Route element={
                    <LayoutGroup>
                    <Layout />
                </LayoutGroup>
                }>
                    {/* Public routes */}
                    <Route
                        path={ROUTES.HOME}
                        element={isAuthenticated ? <CockpitPage /> : <HomePage />}
                    />
                    <Route path={ROUTES.AUTH_CALLBACK} element={<AuthCallback />} />
                    <Route path={ROUTES.TUTORS} element={<TutorsPage />} />
                    <Route path={ROUTES.HELP} element={<HelpPage />} />
                    <Route path={ROUTES.COURSES} element={<CoursesPage />} />

                    {/* Protected routes */}
                    {/*<Route*/}
                    {/*    path={ROUTES.DASHBOARD}*/}
                    {/*    element={*/}
                    {/*        <ProtectedRoute>*/}
                    {/*            <Dashboard />*/}
                    {/*        </ProtectedRoute>*/}
                    {/*    }*/}
                    {/*/>*/}

                    {/* Add more protected routes for tutors, calendar, etc. */}

                    {/* Fallback route */}
                    <Route path="*" element={<Navigate to={ROUTES.HOME} />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;