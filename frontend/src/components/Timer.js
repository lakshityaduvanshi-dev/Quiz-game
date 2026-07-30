import React, { useEffect, useRef, useState } from "react";

// Signature element: a circular ring that depletes as time runs out,
// shifting from amber to red as urgency increases.
const RADIUS = 42;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const Timer = ({ seconds, onExpire, resetKey }) => {
  const [remaining, setRemaining] = useState(seconds);
  const intervalRef = useRef(null);
  const expiredRef = useRef(false);

  useEffect(() => {
    setRemaining(seconds);
    expiredRef.current = false;
    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          if (!expiredRef.current) {
            expiredRef.current = true;
            onExpire && onExpire();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey, seconds]);

  const fraction = Math.max(remaining / seconds, 0);
  const offset = CIRCUMFERENCE * (1 - fraction);
  const urgent = remaining <= Math.min(5, Math.ceil(seconds * 0.2));

  return (
    <div className={`timer-ring ${urgent ? "urgent" : ""}`} role="timer" aria-live="polite">
      <svg viewBox="0 0 100 100" width="88" height="88">
        <circle cx="50" cy="50" r={RADIUS} className="timer-track" />
        <circle
          cx="50"
          cy="50"
          r={RADIUS}
          className="timer-progress"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="timer-value">{remaining}</span>
    </div>
  );
};

export default Timer;
