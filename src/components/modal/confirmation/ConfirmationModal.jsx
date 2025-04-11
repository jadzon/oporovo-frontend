import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from '../shared/Icon';
import {formatUtils} from "../utils/index.js";

export const ConfirmationModal = ({
                                      onClose,
                                      title = 'Potwierdzenie',
                                      message = 'Operacja zakończona pomyślnie',
                                      type = 'success',
                                      data = null,
                                      actionButton = null,
                                      showViewDetailsButton = false,
                                      onViewDetails = null
                                  }) => {
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

    return (
        <>
            {/* Backdrop */}
            <motion.div
                className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                    className={`${styles.bgColor} rounded-lg shadow-lg w-full max-w-md border ${styles.borderColor}`}
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    transition={{
                        type: 'spring',
                        stiffness: 200,
                        damping: 25
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex justify-between items-center p-4 border-b border-opacity-20 border-gray-300">
                        <h2 className="text-lg font-medium text-gray-800">{title}</h2>
                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-full hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            <Icon name="close" className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 text-center">
                        <div className={`mx-auto w-14 h-14 flex items-center justify-center rounded-full ${styles.iconBg} ${styles.iconColor} mb-4`}>
                            <Icon name={styles.icon} className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-medium text-gray-900 mb-2">{message}</h3>

                        {data && (
                            <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                                {typeof data === 'string' ? (
                                    <p className="text-gray-700 text-sm">{data}</p>
                                ) : (
                                    <div className="text-left">
                                        {data.title && (
                                            <p className="font-medium text-gray-900 text-sm mb-2">{data.title}</p>
                                        )}

                                        <div className="space-y-2">
                                            {data.status && (
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs text-gray-600">Status:</span>
                                                    <span className="px-2 py-0.5 text-xs rounded-full bg-blue-50 text-blue-600">
                            {data.status}
                          </span>
                                                </div>
                                            )}

                                            {data.startTime && (
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs text-gray-600">Data rozpoczęcia:</span>
                                                    <span className="text-xs font-medium text-gray-900">
                            {formatUtils.formatDateTime(data.startTime)}
                          </span>
                                                </div>
                                            )}

                                            {data.subject && (
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs text-gray-600">Przedmiot:</span>
                                                    <span className="text-xs font-medium text-gray-900">
                            {data.subject}
                          </span>
                                                </div>
                                            )}

                                            {data.level && (
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs text-gray-600">Poziom:</span>
                                                    <span className="text-xs font-medium text-gray-900">
                            {data.level}
                          </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="p-4 border-t border-opacity-20 border-gray-300 flex flex-col sm:flex-row justify-end gap-3">
                        {showViewDetailsButton && onViewDetails && (
                            <button
                                onClick={onViewDetails}
                                className="px-4 py-2 bg-white border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
                            >
                                Zobacz szczegóły
                            </button>
                        )}

                        {actionButton || (
                            <button
                                onClick={onClose}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                            >
                                Zamknij
                            </button>
                        )}
                    </div>
                </motion.div>
            </div>
        </>
    );
};
