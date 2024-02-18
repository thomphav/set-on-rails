import React, { useState, useEffect } from 'react';
import { formatTimeFromCentiseconds } from '../utils';
import { game } from '../common_types/types';

const Timer = ({ game, gameOver }: { game: game, gameOver: boolean }) => {
  const [startTime, setStartTime] = useState<any>(game.start_time);
  const [endTime, setEndTime] = useState<any>(game.end_time);
  const [initialElapsedTime, setInitialElapsedTime] = useState<number>(startTime ? Date.now() - startTime : 0);
  const [displayTime, setDisplayTime] = useState<string>(initialElapsedTime > 0 ?  formatTimeFromCentiseconds(initialElapsedTime / 10) : "00:00");

  useEffect(() => {
    if (gameOver) {
      console.log(endTime)
      console.log(startTime)
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
      <h2 className="text-4xl">{displayTime}</h2>
    </div>
  );
};

export default Timer;