import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { marked } from 'marked';
import './ChatbotReact.css';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    type?: 'weather' | 'direction' | 'nearby' | 'places' | 'gemini' | 'error';
    data?: any;
    timestamp?: string;
}

interface ChatResponse {
    type: 'weather' | 'direction' | 'nearby' | 'places' | 'gemini' | 'error';
    data: any;
    message: string;
    error?: string;
}

const BACKEND_URL = 'http://localhost:5000';

const ChatbotReact: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState<string>('');
    const [isTyping, setIsTyping] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const suggestions = {
        weather: [
            "What's the weather in New York?",
            "How's the weather in London today?",
            "Is it raining in Tokyo?"
        ],
        places: [
            "Show me hotels in Paris",
            "Find restaurants in Rome",
            "What are the best attractions in Dubai?"
        ],
        historical: [
            "Tell me about the history of the Eiffel Tower",
            "What's the history of the Colosseum?",
            "Share the history of the Great Wall of China"
        ],
        directions: [
            "How do I get from New York to Boston?",
            "Directions from London to Paris",
            "Show me the route from Tokyo to Kyoto"
        ]
    };

    useEffect(() => {
        loadChatHistory();
        checkHealth();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        chatContainerRef.current?.scrollTo({
            top: chatContainerRef.current.scrollHeight,
            behavior: 'smooth',
        });
    };

    const loadChatHistory = async () => {
        try {
            const response = await fetch(`${BACKEND_URL}/chat/history`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            setMessages(data.messages || []);
        } catch (err) {
            console.error('Error loading chat history:', err);
            setError('Failed to load chat history. Please try again.');
        }
    };

    const checkHealth = async () => {
        try {
            const response = await fetch(`${BACKEND_URL}/health`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            if (data.status !== 'ok') {
                setError('Server is not healthy. Please try again later.');
            }
        } catch (err) {
            console.error('Cannot connect to server:', err);
            setError('Cannot connect to server. Please check if it is running.');
        }
    };

    const sendMessage = async (e: FormEvent) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        const userMessage: Message = {
            role: 'user',
            content: inputMessage,
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsTyping(true);
        setError(null);

        try {
            const response = await fetch(`${BACKEND_URL}/ask`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: inputMessage }),
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data: ChatResponse = await response.json();
            setIsTyping(false);

            const botMessage: Message = {
                role: 'assistant',
                content: data.message,
                type: data.type,
                data: data.data,
                timestamp: new Date().toISOString()
            };

            setMessages(prev => [...prev, botMessage]);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
            console.error('Error sending message:', err);
            setIsTyping(false);
            setError(errorMessage);
            setMessages(prev => [
                ...prev,
                {
                    role: 'assistant',
                    content: `Error: ${errorMessage}`,
                    type: 'error',
                    timestamp: new Date().toISOString()
                },
            ]);
        }
    };

    const clearChat = () => {
        setMessages([]);
        setError(null);
    };

    const useSuggestion = (text: string) => {
        setInputMessage(text);
    };

    const renderMessage = (message: Message) => {
        // Render place results specially
        if (message.role === 'assistant' && (message.type === 'nearby' || message.type === 'places') && Array.isArray(message.data)) {
            return (
                <div className="message bot-message">
                    <div className="places-container">
                        {message.data.map((place: any, idx: number) => (
                            <div key={idx} className="place-card">
                                {place.photo && <img src={place.photo} alt={place.name} className="place-photo" />}
                                <div className="place-info">
                                    <h4>{place.name}</h4>
                                    <p>{place.address}</p>
                                    <p>Rating: {place.rating} ({place.user_ratings_total})</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        // Default markdown rendering for assistant
        let content = message.content;
        if (message.type === 'weather' && message.data) {
            const weather = message.data;
            content = `**Weather in ${weather.name}**\n
Temperature: ${weather.main.temp}°C\n
Conditions: ${weather.weather[0].description}\n
Humidity: ${weather.main.humidity}%\n
Wind Speed: ${weather.wind.speed} m/s`;
        } else if (message.type === 'direction' && message.data) {
            const route = message.data.routes[0];
            content = `**Directions**\n
Distance: ${route.legs[0].distance.text}\n
Duration: ${route.legs[0].duration.text}\n
${route.legs[0].steps.map((step: any, i: number) =>
                `${i + 1}. ${step.html_instructions} (${step.distance.text}, ${step.duration.text})`
            ).join('\n')}`;
        }

        return (
            <div className={`message ${message.role === 'user' ? 'user-message' : 'bot-message'}`}>
                <div className="message-content">
                    {message.role === 'assistant' ? (
                        <div dangerouslySetInnerHTML={{ __html: marked(content) }} />
                    ) : (
                        content
                    )}
                </div>
                <div className="message-time">
                    {new Date(message.timestamp || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
            </div>
        );
    };

    return (
        <div className="chatbot-container">
            <div className="chat-header">
                <div className="header-content">
                    <h2>Travel Assistant</h2>
                    <p className="subtitle">Ask me anything about travel!</p>
                </div>
                <button onClick={clearChat} className="clear-button">
                    Clear Chat
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="chat-messages" ref={chatContainerRef}>
                {messages.length === 0 ? (
                    <div className="welcome-message">
                        <h3>Welcome to Travel Assistant!</h3>
                        <p>I can help you with:</p>
                        <div className="welcome-suggestions">
                            {Object.entries(suggestions).map(([category, items]) => (
                                <div key={category} className="welcome-category">
                                    <h4>{category.charAt(0).toUpperCase() + category.slice(1)}</h4>
                                    <div className="welcome-items">
                                        {items.map((suggestion, index) => (
                                            <div
                                                key={index}
                                                className="welcome-item"
                                                onClick={() => useSuggestion(suggestion)}
                                            >
                                                {suggestion}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    messages.map((message, index) => (
                        <div key={index}>
                            {renderMessage(message)}
                        </div>
                    ))
                )}
                {isTyping && (
                    <div className="typing-indicator">
                        <div className="dot"></div>
                        <div className="dot"></div>
                        <div className="dot"></div>
                    </div>
                )}
            </div>

            <div className="suggestions">
                {Object.entries(suggestions).map(([category, items]) => (
                    <div key={category} className="suggestion-category">
                        <h3>{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
                        <div className="suggestion-items">
                            {items.map((suggestion, index) => (
                                <div
                                    key={index}
                                    className="suggestion-chip"
                                    onClick={() => useSuggestion(suggestion)}
                                >
                                    {suggestion}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <form onSubmit={sendMessage} className="chat-input">
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="message-input"
                    disabled={isTyping}
                />
                <button type="submit" className="send-button" disabled={isTyping}>
                    Send
                </button>
            </form>
        </div>
    );
};

export default ChatbotReact;
