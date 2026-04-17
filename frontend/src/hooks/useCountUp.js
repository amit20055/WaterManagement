import { useState, useEffect } from 'react';

export default function useCountUp(endValue, duration = 2000, decimals = 1) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Cubic easing out
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      
      const currentCount = easedProgress * endValue;
      setCount(currentCount);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [endValue, duration]);

  return decimals === 0 ? Math.round(count) : count.toFixed(decimals);
}
