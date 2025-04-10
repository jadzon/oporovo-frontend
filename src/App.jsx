import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser } from './store/thunks/authThunks';
import { selectUserRole } from './store/selectors/authSelectors';

// Components
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import AuthCallback from './components/auth/AuthCallback';
import { ROUTES } from './api/constants';
import TutorCockpit from './pages/TutorCockpitPage';
import StudentCockpit from './pages/StudentCockpitPage';
import TutorsPage from "./pages/TutorsPage";
import HelpPage from "./pages/HelpPage";
import CoursesPage from "./pages/CoursesPage";
import { LayoutGroup } from "framer-motion";

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
    const userRole = useSelector(selectUserRole);
    const isAuthenticated = useSelector(state => !!state.auth.user);

    useEffect(() => {
        try {
            dispatch(getCurrentUser());
        } catch (error) {
            console.error("Error dispatching getCurrentUser:", error);
        }
    }, [dispatch]);

    // Determine which dashboard to show based on role
    const DashboardComponent = userRole === 'tutor' ? TutorCockpit : StudentCockpit;

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
                        element={isAuthenticated ? <DashboardComponent /> : <HomePage />}
                    />
                    <Route path={ROUTES.AUTH_CALLBACK} element={<AuthCallback />} />
                    <Route path={ROUTES.TUTORS} element={<TutorsPage />} />
                    <Route path={ROUTES.HELP} element={<HelpPage />} />
                    <Route path={ROUTES.COURSES} element={<CoursesPage />} />

                    {/* Fallback route */}
                    <Route path="*" element={<Navigate to={ROUTES.HOME} />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;