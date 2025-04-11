// View component for confirmation screens within the modal
import React from 'react';
import { useModal } from '../core/useModal';
import ModalHeader from '../components/ModalHeader';
import ModalActions from '../components/ModalActions';
import { Icon } from '../components/Icon';
import { formatUtils } from '../../../utils';

const ConfirmationView = ({ data }) => {
    const { closeModal, openLessonModal } = useModal();

    if (!data) return null;

    const {
        type = 'success',
        title = 'Potwierdzenie',
        message = 'Operacja zakończona pomyślnie',
        data: confirmationData = null,
        showViewDetailsButton = false,
        lessonObject = null
    } = data;

    // Define icon and colors based on type
    const getTypeStyles = () => {
        switch(type) {
            case 'success':
                return {
                    icon: 'check',
                    bgColor: 'bg-green-50',
                    iconBg: 'bg-green-100',
                    iconColor: 'text-green-600',
                    borderColor: 'border-green-200'
                };
            case 'lesson-created':
                return {
                    icon: 'calendar',
                    bgColor: 'bg-blue-50',
                    iconBg: 'bg-blue-100',
                    iconColor: 'text-blue-600',
                    borderColor: 'border-blue-200'
                };
            case 'error':
                return {
                    icon: 'x-circle',
                    bgColor: 'bg-red-50',
                    iconBg: 'bg-red-100',
                    iconColor: 'text-red-600',
                    borderColor: 'border-red-200'
                };
            default:
                return {
                    icon: 'check',
                    bgColor: 'bg-blue-50',
                    iconBg: 'bg-blue-100',
                    iconColor: 'text-blue-600',
                    borderColor: 'border-blue-200'
                };
        }
    };

    const styles = getTypeStyles();

    // Handler for view details button
    const handleViewDetails = () => {
        if (lessonObject?.id) {
            openLessonModal(lessonObject.id);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <ModalHeader title={title} />

            <div className="flex-1 overflow-y-auto bg-gray-50">
                <div className={`p-6 text-center flex flex-col items-center justify-center h-full ${styles.bgColor}`}>
                    <div className={`mx-auto w-14 h-14 flex items-center justify-center rounded-full ${styles.iconBg} ${styles.iconColor} mb-4`}>
                        <Icon name={styles.icon} className="h-6 w-6" />
                    </div>

                    <h3 className="text-xl font-medium text-gray-900 mb-2">{message}</h3>

                    {confirmationData && (
                        <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200 max-w-md">
                            {typeof confirmationData === 'string' ? (
                                <p className="text-gray-700 text-sm">{confirmationData}</p>
                            ) : (
                                <div className="text-left">
                                    {confirmationData.title && (
                                        <p className="font-medium text-gray-900 text-sm mb-2">{confirmationData.title}</p>
                                    )}

                                    <div className="space-y-2">
                                        {confirmationData.status && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-gray-600">Status:</span>
                                                <span className="px-2 py-0.5 text-xs rounded-full bg-blue-50 text-blue-600">
                          {confirmationData.status}
                        </span>
                                            </div>
                                        )}

                                        {confirmationData.startTime && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-gray-600">Data rozpoczęcia:</span>
                                                <span className="text-xs font-medium text-gray-900">
                          {formatUtils.formatDateTime(confirmationData.startTime)}
                        </span>
                                            </div>
                                        )}

                                        {confirmationData.subject && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-gray-600">Przedmiot:</span>
                                                <span className="text-xs font-medium text-gray-900">
                          {confirmationData.subject}
                        </span>
                                            </div>
                                        )}

                                        {confirmationData.level && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-gray-600">Poziom:</span>
                                                <span className="text-xs font-medium text-gray-900">
                          {confirmationData.level}
                        </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <ModalActions
                primaryAction={{
                    label: "Zamknij",
                    onClick: closeModal
                }}
                secondaryAction={
                    showViewDetailsButton ? {
                        label: "Zobacz szczegóły",
                        icon: "info",
                        onClick: handleViewDetails
                    } : null
                }
            />
        </div>
    );
};

export default ConfirmationView;