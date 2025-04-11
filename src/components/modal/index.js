// Main exports for modal system
// Core components
import Modal from './core/Modal';
import { ModalProvider } from './core/ModalProvider';
import { useModal } from './core/useModal';

// UI Components
import ModalHeader from './components/ModalHeader';
import ModalSection from './components/ModalSection';
import ModalActions from './components/ModalActions';
import ProfileCard from './components/ProfileCard';
import LoadingState from './components/LoadingState';
import { Icon } from './components/Icon';
import { StatusBadge } from './components/StatusBadge';
import { TimeDisplay } from './components/TimeDisplay';

// View components
import LessonDetailsView from './views/LessonDetailsView';
import CourseDetailsView from './views/CourseDetailsView';
import ScheduleFormView from './views/ScheduleFormView';
import ConfirmationView from './views/ConfirmationView';

// Export all components
export {
    // Core
    Modal,
    ModalProvider,
    useModal,

    // UI Components
    ModalHeader,
    ModalSection,
    ModalActions,
    ProfileCard,
    LoadingState,
    Icon,
    StatusBadge,
    TimeDisplay,

    // Views
    LessonDetailsView,
    CourseDetailsView,
    ScheduleFormView,
    ConfirmationView
};