import React, { useState, useEffect } from 'react';
import { setCsrfToken } from './utils';
import { game } from './types';

const Timer = ({ game, gameOver }: { game: game, gameOver: boolean }) => {
  const formatTimeFromCentiseconds = (centiseconds: number) => {
    const totalSeconds = Math.floor(centiseconds / 100);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return [minutes, seconds].map(v => v.toString().padStart(2, '0')).join(":");
  };

  const [idempotentStartTimeCheck, setIdempotentStartTimeCheck] = useState<boolean>(!!game.start_time);
  const [startTime, setStartTime] = useState<number>(game.start_time || Date.now());
  const [initialElapsedTime, setInitialElapsedTime] = useState<number>(game.start_time ? Date.now() - game.start_time : 0);
  const [displayTime, setDisplayTime] = useState<string>(game.start_time ?  formatTimeFromCentiseconds(initialElapsedTime / 10) : "00:00");

  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      const now = Date.now();
      if (!idempotentStartTimeCheck) {
        handleUpdateGameStartTime(startTime);
      }
      const elapsedTime = now - startTime;
      setDisplayTime(formatTimeFromCentiseconds(Math.floor(elapsedTime / 10)));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, idempotentStartTimeCheck, gameOver]);

  const handleUpdateGameStartTime = async (now: number) => {
    const token = setCsrfToken();
    try {
      await fetch(`/internal_api/games/${game.id}`, {
        method: 'PATCH',
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "Content-Type": "application/json",
          "X-CSRF-Token": token,
        },
        body: JSON.stringify({ start_time: now })
      });

      setIdempotentStartTimeCheck(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center">
      <h2 className="text-4xl">{displayTime}</h2>
    </div>
  );
};

export default Timer;