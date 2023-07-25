// FontSetter.jsx
import { useEffect, useContext } from "react";
import { FontContext } from "./FontContext";

const FontSetter = () => {
  const { font } = useContext(FontContext);

  useEffect(() => {
    if(!font) return
    if(font === 'sans') {
        document.documentElement.style.setProperty(
          "font-family",
          "Open Sans, sans-serif"
        );
    } else if(font === 'serif') {
        document.documentElement.style.setProperty(
          "font-family",
          "Merriweather, serif"
        );
    } else if(font === 'mono') {
        document.documentElement.style.setProperty(
          "font-family",
          "IBM Plex Mono, monospace"
        );
    }
  }, [font]);

  return null;
};

export default FontSetter;
