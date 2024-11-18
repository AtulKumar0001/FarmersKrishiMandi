export interface Message {
  text: string;
  sender: "user" | "ai";
}

export interface Translations {
  startChatting: string;
  typePlaceholder: string;
  send: string;
  selectVoice: string;
  autoSpeakLabel: string;
  speakButton: string;
  stopSpeakingButton: string;
  errorSpeaking: string;
  noVoiceSelected: string;
  noHindiVoice: string;
  speechSynthesisNotSupported: string;
  speechRecognitionNotSupported: string;
  languageOptions: { [key: string]: string };
}

// Define SpeechRecognition type
export interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
}

// Define SpeechRecognitionEvent type
export interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

// Define SpeechRecognitionErrorEvent type
export interface SpeechRecognitionErrorEvent {
  error: string;
}
