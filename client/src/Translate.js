

import React, { useState, useEffect } from "react";
import { translate } from "google-translate-api-browser"; // Translation library

import { franc } from "franc"; // Language detection

const Translate = ({ text }) => {
  const [translatedText, setTranslatedText] = useState("");

  useEffect(() => {
    const performTranslation = async () => {
      if (text) {
        try {
          // Detect language using `franc` and handle short text fallback
          let detectedLang = franc(text);
          console.log("Detected Language:", detectedLang); // Debugging

          if (detectedLang === "und" || text.length <= 3) {
            console.log("Language detection failed. Falling back to Telugu (te).");
            detectedLang = "te"; // Fallback to Telugu
          }

          // Translate text using `google-translate-api-browser`
          const response = await translate(text, { from: detectedLang, to: "en" });
          console.log("Translation Result:", response.text); // Debugging
          setTranslatedText(response.text);
        } catch (error) {
          console.error("Translation Error:", error);
          setTranslatedText("Translation failed.");
        }
      }
    };

    performTranslation();
  }, [text]);

  return <span>{translatedText}</span>;
};

export default Translate;