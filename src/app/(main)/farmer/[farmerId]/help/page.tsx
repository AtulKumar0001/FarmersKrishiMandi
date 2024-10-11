'use client';

import React, { useState, useRef, useEffect } from 'react';

const KrishiGPT: React.FC = () => {
    const [messages, setMessages] = useState<Array<{ text: string; sender: 'user' | 'ai' }>>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('en-US');
    const [showLanguageModal, setShowLanguageModal] = useState(true);
    const [isSpeechRecognitionSupported, setIsSpeechRecognitionSupported] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputMessage.trim() === '') return;
        sendMessage(inputMessage);
    };

    const sendMessage = (text: string) => {
        setMessages(prev => [...prev, { text, sender: 'user' }]);
        setInputMessage('');

        // Simulate AI response (replace with actual AI integration)
        setTimeout(() => {
            const aiResponse = "This is a simulated AI response.";
            setMessages(prev => [...prev, { text: aiResponse, sender: 'ai' }]);
        }, 1000);
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
        if (typeof window !== 'undefined') {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = selectedLanguage;
            window.speechSynthesis.speak(utterance);
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
                            <option value="hi-IN">Hindi</option>
                            <option value="pa-IN">Punjabi</option>
                            <option value="ta-IN">Tamil</option>
                            <option value="mr-IN">Marathi</option>
                            <option value="bn-IN">Bengali</option>
                            <option value="ks-IN">Kashmiri</option>
                            <option value="doi-IN">Dogri</option>
                            <option value="as-IN">Assamese</option>
                            <option value="kn-IN">Kannada</option>
                            <option value="te-IN">Telugu</option>
                            <option value="gu-IN">Gujarati</option>
                            <option value="ur-IN">Urdu</option>
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
                        <div className={`max-w-xs p-3 rounded-lg flex items-center space-x-2 ${message.sender === 'user' ? 'bg-blue-600' : 'bg-gray-700'
                            }`}>
                            <p>{message.text}</p>
                            {message.sender === 'ai' && (
                                <button
                                    className="text-gray-300 hover:text-white"
                                    onClick={() => speakMessage(message.text)}
                                >
                                    🔊
                                </button>
                            )}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700">
                <div className="flex space-x-2">
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
            </form>

            <div className="m-4 bg-blue-900 p-4 rounded">
                <h3 className="font-bold">Tip</h3>
                <p>
                    Click the microphone icon to start/stop speech input. The text will appear in the input field as you speak. Click send to submit the message.
                </p>
            </div>
        </div>
    );
};

export default KrishiGPT;