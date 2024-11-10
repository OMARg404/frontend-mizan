import React, { useState, useEffect } from 'react';

const DigitalClock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US');
  };

  return (
    <div>
      <div>{formatDate(currentTime)}</div>
      <div>{formatTime(currentTime)}</div>
    </div>
  );
};

export default DigitalClock;
