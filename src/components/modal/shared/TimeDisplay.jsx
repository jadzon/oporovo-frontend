import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { timeUtils } from '../utils';

/**
 * Component for displaying lesson time status
 */
const TimeDisplay = ({ startTime, endTime }) => {
    const [timeStatus, setTimeStatus] = useState({
        timeText: 'Ładowanie...',
        timePercentage: 0
    });

    useEffect(() => {
        if (!startTime || !endTime) return;

        const updateTimer = () => {
            const status = timeUtils.calculateTimeStatus(startTime, endTime);
            setTimeStatus(status);
        };

        // Update immediately
        updateTimer();

        // Update every second
        const timerId = setInterval(updateTimer, 1000);
        return () => clearInterval(timerId);
    }, [startTime, endTime]);

    return (
        <div className="mt-4">
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-purple-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${timeStatus.timePercentage}%` }}
                    transition={{ duration: 0.5 }}
                />
            </div>
            <p className="mt-2 text-lg font-medium text-gray-900">{timeStatus.timeText}</p>
        </div>
    );
};

export default TimeDisplay;