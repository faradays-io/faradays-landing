import { useEffect, useState } from "react";

const DotsCycle = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % 4);
    }, 550);
    return () => clearInterval(interval);
  }, []);

  const maxDots = 3;
  return (
    <span className="inline-flex" style={{ width: "1.5em" }}>
      {Array.from({ length: maxDots }).map((_, i) => (
        <span
          key={i}
          className="transition-opacity duration-300 ease-in-out"
          style={{ opacity: i < step ? 1 : 0 }}
        >
          .
        </span>
      ))}
    </span>
  );
};

export default DotsCycle;
