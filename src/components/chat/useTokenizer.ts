import { useEffect, useState } from "react";

export function useTokenizer(text: string, speed = 30) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      setDisplayed(prev => prev + text[i]);
      i++;
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);

  return displayed;
}
