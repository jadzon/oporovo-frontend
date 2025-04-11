// Component for displaying time-related information for lessons
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export const TimeDisplay = ({ startTime, endTime }) => {
    const [timeStatus, setTimeStatus] = useState({
        timeText: "Ładowanie...",
        timePercentage: 0,
        isLive: false,
    });

    useEffect(() => {
        if (!startTime || !endTime) return;

        const updateTimer = () => {
            const now = new Date();
            const start = new Date(startTime);
            const end = new Date(endTime);

            // If lesson is in the future
            if (now < start) {
                const diff = start - now;
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

                let timeText = "";
                if (days > 0) {
                    timeText = `Za ${days} ${days === 1 ? "dzień" : days < 5 ? "dni" : "dni"}`;
                } else if (hours > 0) {
                    timeText = `Za ${hours} ${hours === 1 ? "godzinę" : hours < 5 ? "godziny" : "godzin"}`;
                } else {
                    timeText = `Za ${minutes} ${minutes === 1 ? "minutę" : minutes < 5 ? "minuty" : "minut"}`;
                }

                setTimeStatus({ timeText, timePercentage: 0, isLive: false });
            }
            // If lesson is in progress
            else if (now >= start && now <= end) {
                const total = end - start;
                const elapsed = now - start;
                const percentage = Math.min(100, (elapsed / total) * 100);

                const remaining = end - now;
                const minutes = Math.ceil(remaining / (1000 * 60));

                const timeText = `W trakcie (pozostało ${minutes} ${minutes === 1 ? "minuta" : minutes < 5 ? "minuty" : "minut"})`;

                setTimeStatus({ timeText, timePercentage: percentage, isLive: true });
            }
            // If lesson has ended
            else {
                const diff = now - end;
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));

                let timeText = "";
                if (days > 0) {
                    timeText = `Zakończona ${days} ${days === 1 ? "dzień" : days < 5 ? "dni" : "dni"} temu`;
                } else {
                    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    if (hours > 0) {
                        timeText = `Zakończona ${hours} ${hours === 1 ? "godzinę" : hours < 5 ? "godziny" : "godzin"} temu`;
                    } else {
                        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                        timeText = `Zakończona ${minutes} ${minutes === 1 ? "minutę" : minutes < 5 ? "minuty" : "minut"} temu`;
                    }
                }

                setTimeStatus({ timeText, timePercentage: 100, isLive: false });
            }
        };

        // Update immediately
        updateTimer();

        // Update every minute
        const timerId = setInterval(updateTimer, 60000);
        return () => clearInterval(timerId);
    }, [startTime, endTime]);

    return (
        <div className="mt-2">
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                    className={`h-full ${timeStatus.isLive ? "bg-black" : timeStatus.timePercentage === 100 ? "bg-green-500" : "bg-gray-300"}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${timeStatus.timePercentage}%` }}
                    transition={{ duration: 0.5 }}
                />
            </div>
            <div className="flex justify-between items-center mt-1.5">
                <p
                    className={`text-sm font-medium ${timeStatus.isLive ? "text-black" : timeStatus.timePercentage === 100 ? "text-green-600" : "text-gray-600"}`}
                >
                    {timeStatus.timeText}
                </p>
                {timeStatus.isLive && (
                    <span className="flex items-center gap-1 text-xs bg-gray-50 text-black px-2 py-0.5 rounded-full">
                        <span className="w-2 h-2 bg-black rounded-full animate-pulse"></span>
                        Na żywo
                    </span>
                )}
            </div>
        </div>
    );
};

export default TimeDisplay;