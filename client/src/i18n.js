import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        title: "Multilingual Video Call and Chat",
        joinRoom: "Join Room",
        joinedRoom: "You have joined the room",
        enterMessage: "Enter your message",
        send: "Send",
        subtitles: "Subtitles",
      },
    },
    te: {
      translation: {
        title: "బహుభాషా వీడియో కాల్ మరియు చాట్",
        joinRoom: "గది చేరండి",
        joinedRoom: "మీరు గదిలో చేరారు",
        enterMessage: "మీ సందేశాన్ని నమోదు చేయండి",
        send: "పంపించండి",
        subtitles: "సబ్‌టైటిల్స్",
      },
    },
  },
  lng: "en", // Default language
  fallbackLng: "en", // Fallback language
  interpolation: {
    escapeValue: false, // React already escapes values
  },
});

export default i18n;