import React, { useState, useEffect } from 'react';
import { formatTimeFromCentiseconds } from '../utils';
import { game } from '../common_types/types';

const Timer = ({ game, gameOver, endTime }: { game: game, gameOver: boolean, endTime: number }) => {
  const [startTime, setStartTime] = useState<any>(game.start_time);
  const [initialElapsedTime, setInitialElapsedTime] = useState<number>(startTime ? Date.now() - startTime : 0);
  const [displayTime, setDisplayTime] = useState<string>(initialElapsedTime > 0 ?  formatTimeFromCentiseconds(initialElapsedTime / 10) : "00:00");

  useEffect(() => {
    if (gameOver) {
      const elapsedTime = endTime - startTime;
      setDisplayTime(formatTimeFromCentiseconds(Math.floor(elapsedTime / 10)));
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now()
      const elapsedTime = now - startTime;
      setDisplayTime(formatTimeFromCentiseconds(Math.floor(elapsedTime / 10)));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, endTime, gameOver]);

  return (
    <div className="flex justify-center">
      <h2 className="text-xl min-[420px]:text-2xl lg:text-3xl">{displayTime}</h2>
    </div>
  );
};

export default Timer;