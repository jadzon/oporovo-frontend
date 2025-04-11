// ModalProvider.jsx
// Context provider for modal state
import React, { createContext, useReducer, useCallback, useEffect } from 'react';

// Initial state for the modal
const initialState = {
    isOpen: false,
    type: null, // 'lesson', 'course', 'schedule'
    id: null,
    view: null, // Additional view state for multi-step flows
    history: [], // Stack for navigation history
    confirmationData: null, // Data for confirmation views
};

// Create context
export const ModalContext = createContext(null);

// Reducer for modal state management
const modalReducer = (state, action) => {
    switch (action.type) {
        case 'OPEN_MODAL':
            return {
                ...state,
                isOpen: true,
                type: action.payload.type,
                id: action.payload.id,
                view: action.payload.view || null,
                history: [], // Reset history on new modal open
                confirmationData: null,
            };

        case 'CLOSE_MODAL':
            return {
                ...initialState,
            };

        case 'CHANGE_VIEW':
            return {
                ...state,
                view: action.payload.view,
                // Add current view to history stack for back navigation
                history: [...state.history, {
                    view: state.view,
                    params: action.payload.params || {}
                }],
            };

        case 'GO_BACK':
            if (state.history.length === 0) {
                return state;
            }

            // Pop the last item from history
            const newHistory = [...state.history];
            const lastView = newHistory.pop();

            return {
                ...state,
                view: lastView.view,
                history: newHistory,
            };

        case 'SHOW_CONFIRMATION':
            return {
                ...state,
                confirmationData: action.payload,
            };

        case 'HIDE_CONFIRMATION':
            return {
                ...state,
                confirmationData: null,
            };

        case 'SYNC_WITH_URL':
            // Synchronize state from URL parameters
            return {
                ...state,
                isOpen: action.payload.isOpen,
                type: action.payload.type,
                id: action.payload.id,
                view: action.payload.view,
            };

        default:
            return state;
    }
};

export const ModalProvider = ({ children }) => {
    const [state, dispatch] = useReducer(modalReducer, initialState);

    // Navigate to a new view within the modal
    const navigateToView = useCallback((newView, params = {}) => {
        dispatch({
            type: 'CHANGE_VIEW',
            payload: {
                view: newView,
                params
            }
        });
    }, []);

    // Update URL when modal state changes
    useEffect(() => {
        if (state.isOpen && state.type && state.id) {
            // Build the URL query string
            const params = new URLSearchParams(window.location.search);
            params.set('modal', state.type);
            params.set('id', state.id);

            if (state.view) {
                params.set('view', state.view);
            } else {
                params.delete('view');
            }

            // Update the URL without reloading the page
            const newUrl = `${window.location.pathname}?${params.toString()}`;
            window.history.replaceState({}, '', newUrl);
        } else if (!state.isOpen) {
            // Remove modal parameters when closed
            const url = new URL(window.location.href);
            url.searchParams.delete('modal');
            url.searchParams.delete('id');
            url.searchParams.delete('view');

            window.history.replaceState({}, '', url);
        }
    }, [state.isOpen, state.type, state.id, state.view]);

    // Handle URL changes (browser back/forward)
    useEffect(() => {
        const handlePopState = () => {
            const url = new URL(window.location.href);
            const modalParam = url.searchParams.get('modal');
            const idParam = url.searchParams.get('id');
            const viewParam = url.searchParams.get('view');

            if (modalParam && idParam) {
                dispatch({
                    type: 'SYNC_WITH_URL',
                    payload: {
                        isOpen: true,
                        type: modalParam,
                        id: idParam,
                        view: viewParam || null,
                    },
                });
            } else {
                dispatch({ type: 'CLOSE_MODAL' });
            }
        };

        window.addEventListener('popstate', handlePopState);

        // Initial URL check
        const url = new URL(window.location.href);
        const modalParam = url.searchParams.get('modal');
        const idParam = url.searchParams.get('id');
        const viewParam = url.searchParams.get('view');

        if (modalParam && idParam) {
            dispatch({
                type: 'SYNC_WITH_URL',
                payload: {
                    isOpen: true,
                    type: modalParam,
                    id: idParam,
                    view: viewParam || null,
                },
            });
        }

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, []);

    const value = {
        state,
        dispatch,
        navigateToView,
    };

    return (
        <ModalContext.Provider value={value}>
            {children}
        </ModalContext.Provider>
    );
};