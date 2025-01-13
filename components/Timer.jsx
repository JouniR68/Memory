import React, { useState, useEffect } from "react";

const Timer = ({ isRunning }) => {
    const [time, setTime] = useState(0);

    useEffect(() => {
        let timerInterval;

        if (isRunning) {
            timerInterval = setInterval(() => {
                setTime((prevTime) => prevTime + 1);
            }, 1000);
        } else {
            clearInterval(timerInterval);
        }

        return () => clearInterval(timerInterval); // Cleanup when component unmounts or `isRunning` changes
    }, [isRunning]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
            .toString()
            .padStart(2, "0")}`;
    };

    return (
        <div style={{ textAlign: "center", margin: "20px" }}>
            <h1>Timer</h1>
            <h2>{formatTime(time)}</h2>
        </div>
    );
};

export default Timer;
