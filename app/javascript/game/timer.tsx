import React, { useState, useEffect } from 'react';
import { setCsrfToken, formatTimeFromCentiseconds } from './utils';
import { game } from '../common_types/types';

const Timer = ({ game, gameOver }: { game: game, gameOver: boolean }) => {
  const fetchStartTime = async () => {
    const token = setCsrfToken();
    try {
      const response = await fetch(`/internal_api/games/${game.id}`, {
        method: 'GET',
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "Content-Type": "application/json",
          "X-CSRF-Token": token,
        }
      });

      const data = await response.json();

      if (data.start_time) {
        setStartTime(data.start_time)
        setIdempotentStartTimeCheck(true);
      } else {
        setStartTime(Date.now())
      }
    } catch (error) {
      console.error(error);
    }
  };

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

  const [startTime, setStartTime] = useState<any>(game.start_time);
  const [initialElapsedTime, setInitialElapsedTime] = useState<number>(startTime ? Date.now() - startTime : 0);
  const [displayTime, setDisplayTime] = useState<string>(initialElapsedTime > 0 ?  formatTimeFromCentiseconds(initialElapsedTime / 10) : "00:00");
  const [idempotentStartTimeCheck, setIdempotentStartTimeCheck] = useState<boolean>(false);

  useEffect(() => {
    if (!startTime) {
      fetchStartTime();
    }
  }, []);

  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      const now = Date.now()
      if (!idempotentStartTimeCheck) {
        handleUpdateGameStartTime(startTime);
      }
      const elapsedTime = now - startTime;
      setDisplayTime(formatTimeFromCentiseconds(Math.floor(elapsedTime / 10)));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, idempotentStartTimeCheck, gameOver]);

  return (
    <div className="flex justify-center">
      <h2 className="text-4xl">{displayTime}</h2>
    </div>
  );
};

export default Timer;