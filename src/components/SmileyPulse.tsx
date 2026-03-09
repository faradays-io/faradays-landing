import { useEffect, useState } from "react";

const SmileyPulse = () => {
  const [alt, setAlt] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setAlt((p) => !p), 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span
      className="inline-block transition-opacity duration-700"
      style={{ opacity: alt ? 0.5 : 1 }}
    >
      :)
    </span>
  );
};

export default SmileyPulse;
