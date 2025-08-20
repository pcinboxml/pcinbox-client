import { useEffect, useState } from "react";
import { LinearProgress } from "@mui/material";

const LinearProgressComponent = () => {
  const [progress, setProgress] = useState(0);
  const [buffer, setBuffer] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress >= 100 ? 0 : prevProgress + Math.random() * 10
      );
      setBuffer((prevBuffer) =>
        prevBuffer >= 100 ? 10 : prevBuffer + Math.random() * 10
      );
    }, 500);

    return () => clearInterval(timer);
  }, []);

  return (
    <LinearProgress
      variant="buffer"
      value={progress}
      valueBuffer={buffer}
      color="error"
    />
  );
};

export default LinearProgressComponent;
