'use client';

import React, { useState, useRef, useEffect } from 'react';
import { getGeneratedContent } from '@/utils/gemini'; // Import the generateContent function

interface Message {
  text: string;
  sender: 'user' | 'ai';
}

const KrishiGPT: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('en-US');
    const [showLanguageModal, setShowLanguageModal] = useState(true);
    const [isSpeechRecognitionSupported, setIsSpeechRecognitionSupported] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [autoSpeak, setAutoSpeak] = useState(false);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
    const [voiceError, setVoiceError] = useState<string | null>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
                recognitionRef.current = new SpeechRecognition();
                recognitionRef.current.continuous = true;
                recognitionRef.current.interimResults = true;
                recognitionRef.current.lang = selectedLanguage;

                recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
                    const transcript = Array.from(event.results)
                        .map(result => result[0])
                        .map(result => result.transcript)
                        .join('');
                    setInputMessage(transcript);
                };

                recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
                    console.error('Speech recognition error', event.error);
                    setIsListening(false);
                };

                recognitionRef.current.onend = () => {
                    setIsListening(false);
                };
            } else {
                setIsSpeechRecognitionSupported(false);
            }
        }
    }, [selectedLanguage]);

    useEffect(() => {
        const loadVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            setVoices(availableVoices);
            
            const hindiVoice = availableVoices.find(voice => voice.lang.startsWith('hi-'));
            if (hindiVoice) {
                setSelectedVoice(hindiVoice);
                setVoiceError(null);
            } else {
                // Fallback to the first available voice
                setSelectedVoice(availableVoices[0]);
                setVoiceError("No Hindi voice found. Using default voice.");
            }
        };

        if (typeof window !== 'undefined' && window.speechSynthesis) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
            loadVoices();
        } else {
            setVoiceError("Speech synthesis not supported in this browser.");
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (inputMessage.trim() === '') return;
        sendMessage(inputMessage);
        setInputMessage(''); // Clear input after sending
        if (isListening) {
            recognitionRef.current?.stop(); // Stop listening after sending
            setIsListening(false);
        }
    };

    const sendMessage = async (text: string) => {
        setMessages(prev => [...prev, { text, sender: 'user' }]);
        setInputMessage('');

        try {
            const str="word limit maximum 300 words"
            const aiResponse = await getGeneratedContent(text+str);
            const formattedResponse = formatAIResponse(aiResponse);
            setMessages(prev => [...prev, { text: formattedResponse, sender: 'ai' }]);
            if (autoSpeak) {
                speakMessage(formattedResponse);
            }
        } catch (error) {
            console.error("Error generating AI response:", error);
            setMessages(prev => [...prev, { text: "Sorry, I couldn't generate a response. Please try again.", sender: 'ai' }]);
        }
    };

    const formatAIResponse = (response: string) => {
        // Remove markdown-style formatting and improve readability
        return response
            .replace(/(\*\*|__)(.*?)\1/g, '$2')  // Remove bold formatting
            .replace(/(\*|_)(.*?)\1/g, '$2')     // Remove italic formatting
            .replace(/^(#+)\s+/gm, '')           // Remove headers
            .replace(/^[-*+]\s+/gm, '• ')        // Convert unordered lists to bullet points
            .replace(/^\d+\.\s+/gm, '• ')        // Convert ordered lists to bullet points
            .replace(/`([^`]+)`/g, '$1')         // Remove inline code formatting
            .replace(/```[\s\S]*?```/g, '')      // Remove code blocks
            .replace(/\n{3,}/g, '\n\n')          // Reduce multiple newlines to maximum two
            .split('\n')                         // Split into lines
            .map(line => line.trim())            // Trim each line
            .join('\n')                          // Join lines back together
            .trim()                              // Trim the entire result
            .replace(/([.!?])\s+/g, '$1\n')      // Add newline after sentences
            .replace(/\n{3,}/g, '\n\n');         // Again, ensure maximum two consecutive newlines
    };

    const toggleListening = () => {
        if (!isSpeechRecognitionSupported) {
            alert('Speech recognition is not supported in your browser.');
            return;
        }

        if (isListening) {
            recognitionRef.current?.stop();
        } else {
            recognitionRef.current?.start();
            setIsListening(true);
        }
    };

    const speakMessage = (text: string) => {
        if (typeof window !== 'undefined' && window.speechSynthesis && selectedVoice) {
            if (isSpeaking) {
                window.speechSynthesis.cancel();
                setIsSpeaking(false);
            } else {
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.voice = selectedVoice;
                utterance.onend = () => setIsSpeaking(false);
                utterance.onerror = (event) => {
                    console.error('Speech synthesis error:', event);
                    setVoiceError(`Error speaking: ${event.error}`);
                    setIsSpeaking(false);
                };
                window.speechSynthesis.speak(utterance);
                setIsSpeaking(true);
            }
        } else {
            setVoiceError("Unable to speak. No voice selected or speech synthesis not supported.");
        }
    };

    const handleVoiceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const voice = voices.find(v => v.name === event.target.value);
        if (voice) {
            setSelectedVoice(voice);
            setVoiceError(null);
        }
    };

    return (
        <div className="flex flex-col h-[80vh] bg-gray-100 dark:bg-gray-900 text-gray-100">
            {showLanguageModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-80">
                        <h2 className="text-xl font-bold mb-4 text-gray-100">Select Language</h2>
                        <select
                            className="w-full p-2 bg-gray-700 rounded"
                            onChange={(e) => setSelectedLanguage(e.target.value)}
                            value={selectedLanguage}
                        >
                            <option value="en-IN">English</option>
                            <option value="hi-IN">हिन्दी</option>
                            <option value="pa-IN">ਪੰਜਾਬੀ</option>
                            <option value="ta-IN">தமிழ்</option>
                            <option value="mr-IN">मराठी</option>
                            <option value="bn-IN">বাংলা</option>
                            <option value="ks-IN">कॉशुर</option>
                            <option value="doi-IN">डोगरी</option>
                            <option value="as-IN">অসমীয়া</option>
                            <option value="kn-IN">ಕನ್ನಡ</option>
                            <option value="te-IN">తెలుగు</option>
                            <option value="gu-IN">ગુજરાતી</option>
                            <option value="ur-IN">اردو</option>
                        </select>
                        <button
                            className="mt-4 w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                            onClick={() => setShowLanguageModal(false)}
                        >
                            Start Chatting
                        </button>
                    </div>
                </div>
            )}

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                    <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-3xl p-3 rounded-lg ${
                            message.sender === 'user' ? 'bg-blue-600' : 'bg-gray-700'
                        }`}>
                            <p className="whitespace-pre-wrap">{message.text}</p>
                            {message.sender === 'ai' && (
                                <button
                                    className="mt-2 text-gray-300 hover:text-white bg-gray-600 hover:bg-gray-500 p-1 rounded"
                                    onClick={() => speakMessage(message.text)}
                                >
                                    {isSpeaking ? 'Stop Speaking' : 'Speak'}
                                </button>
                            )}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700">
                <div className="flex space-x-2 mb-2">
                    <input
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 bg-gray-800 text-white p-2 rounded"
                    />
                    <button
                        type="button"
                        className={`p-2 rounded ${isListening ? 'bg-red-600' : 'bg-gray-800'} text-white`}
                        onClick={toggleListening}
                    >
                        {isListening ? '⏹️' : '🎤'}
                    </button>
                    <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
                        Send
                    </button>
                </div>
                <div className="flex flex-col space-y-2 mt-2">
                    <div className="flex items-center space-x-2">
                        <label htmlFor="voiceSelect" className="text-sm text-gray-300">
                            Select Voice:
                        </label>
                        <select
                            id="voiceSelect"
                            value={selectedVoice?.name}
                            onChange={handleVoiceChange}
                            className="bg-gray-800 text-white p-1 rounded"
                        >
                            {voices.map((voice) => (
                                <option key={voice.name} value={voice.name}>
                                    {`${voice.name} (${voice.lang})`}
                                </option>
                            ))}
                        </select>
                    </div>
                    {voiceError && (
                        <p className="text-yellow-500 text-sm">{voiceError}</p>
                    )}
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="autoSpeak"
                            checked={autoSpeak}
                            onChange={(e) => setAutoSpeak(e.target.checked)}
                            className="form-checkbox h-5 w-5 text-blue-600"
                        />
                        <label htmlFor="autoSpeak" className="text-sm text-gray-300">
                            Auto-speak AI responses
                        </label>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default KrishiGPT;
