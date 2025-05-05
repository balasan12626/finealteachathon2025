// import React, { useState, useEffect, useRef, FormEvent } from 'react';
// import { marked } from 'marked';
// import { 
//   Input, Button, Card, Space, Typography, Avatar, 
//   List, Tag, AutoComplete, message, Divider, Row, Col 
// } from 'antd';
// import { 
//   SendOutlined, ClearOutlined, 
//   EnvironmentOutlined, CloudOutlined, 
//   HomeOutlined, HistoryOutlined 
// } from '@ant-design/icons';
// import './ChatbotReact.css';

// const { Title, Text } = Typography;
// const { Search } = Input;

// interface Message {
//     role: 'user' | 'assistant';
//     content: string;
//     type?: 'weather' | 'direction' | 'nearby' | 'places' | 'gemini' | 'error';
//     data?: any;
//     timestamp?: string;
// }

// interface ChatResponse {
//     type: 'weather' | 'direction' | 'nearby' | 'places' | 'gemini' | 'error';
//     data: any;
//     message: string;
//     error?: string;
// }

// const BACKEND_URL = 'http://localhost:5000';

// const ChatbotReact: React.FC = () => {
//     const [messages, setMessages] = useState<Message[]>([]);
//     const [inputMessage, setInputMessage] = useState<string>('');
//     const [isTyping, setIsTyping] = useState<boolean>(false);
//     const [error, setError] = useState<string | null>(null);
//     const [recentSearches, setRecentSearches] = useState<string[]>([]);
//     const chatContainerRef = useRef<HTMLDivElement>(null);

//     const suggestions = {
//         weather: [
//             { text: "What's the weather in Chennai?", icon: <CloudOutlined /> },
//             { text: "Is it raining in Madurai?", icon: <CloudOutlined /> },
//             { text: "How hot is it in Coimbatore?", icon: <CloudOutlined /> }
//         ],
//         places: [
//             { text: "Show me hotels in Kodaikanal", icon: <HomeOutlined /> },
//             { text: "Find restaurants in Ooty", icon: <HomeOutlined /> },
//             { text: "What are the best attractions in Thanjavur?", icon: <HomeOutlined /> }
//         ],
//         directions: [
//             { text: "How do I get from Chennai to Rameswaram?", icon: <EnvironmentOutlined /> },
//             { text: "Directions from Madurai to Kanyakumari", icon: <EnvironmentOutlined /> },
//             { text: "Show me the route from Coimbatore to Ooty", icon: <EnvironmentOutlined /> }
//         ]
//     };

//     useEffect(() => {
//         loadChatHistory();
//         checkHealth();
//     }, []);

//     useEffect(() => {
//         scrollToBottom();
//     }, [messages]);

//     const scrollToBottom = () => {
//         chatContainerRef.current?.scrollTo({
//             top: chatContainerRef.current.scrollHeight,
//             behavior: 'smooth',
//         });
//     };

//     const loadChatHistory = async () => {
//         try {
//             const response = await fetch(`${BACKEND_URL}/chat/history`);
//             if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
//             const data = await response.json();
//             setMessages(data.messages || []);
//         } catch (err) {
//             console.error('Error loading chat history:', err);
//             setError('Failed to load chat history. Please try again.');
//         }
//     };

//     const checkHealth = async () => {
//         try {
//             const response = await fetch(`${BACKEND_URL}/health`);
//             if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
//             const data = await response.json();
//             if (data.status !== 'ok') {
//                 setError('Server is not healthy. Please try again later.');
//             }
//         } catch (err) {
//             console.error('Cannot connect to server:', err);
//             setError('Cannot connect to server. Please check if it is running.');
//         }
//     };

//     const sendMessage = async (e: FormEvent) => {
//         e.preventDefault();
//         if (!inputMessage.trim()) return;

//         const userMessage: Message = {
//             role: 'user',
//             content: inputMessage,
//             timestamp: new Date().toISOString()
//         };

//         setMessages(prev => [...prev, userMessage]);
//         setInputMessage('');
//         setIsTyping(true);
//         setError(null);

//         try {
//             const response = await fetch(`${BACKEND_URL}/ask`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ prompt: inputMessage }),
//             });

//             if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

//             const data: ChatResponse = await response.json();
//             setIsTyping(false);

//             const botMessage: Message = {
//                 role: 'assistant',
//                 content: data.message,
//                 type: data.type,
//                 data: data.data,
//                 timestamp: new Date().toISOString()
//             };

//             setMessages(prev => [...prev, botMessage]);
//         } catch (err) {
//             const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
//             console.error('Error sending message:', err);
//             setIsTyping(false);
//             setError(errorMessage);
//             setMessages(prev => [
//                 ...prev,
//                 {
//                     role: 'assistant',
//                     content: `Error: ${errorMessage}`,
//                     type: 'error',
//                     timestamp: new Date().toISOString()
//                 },
//             ]);
//         }
//     };

//     const clearChat = () => {
//         setMessages([]);
//         setError(null);
//     };

//     const useSuggestion = (text: string) => {
//         setInputMessage(text);
//     };

//     const renderMessage = (message: Message) => {
//         if (message.role === 'assistant' && (message.type === 'nearby' || message.type === 'places') && Array.isArray(message.data)) {
//             return (
//                 <Card className="message-card">
//                     <List
//                         dataSource={message.data}
//                         renderItem={(place: any) => (
//                             <List.Item>
//                                 <Card.Meta
//                                     avatar={place.photo && <Avatar src={place.photo} />}
//                                     title={place.name}
//                                     description={
//                                         <Space direction="vertical">
//                                             <Text>{place.address}</Text>
//                                             <Tag color="blue">Rating: {place.rating}</Tag>
//                                         </Space>
//                                     }
//                                 />
//                             </List.Item>
//                         )}
//                     />
//                 </Card>
//             );
//         }

//         return (
//             <div className={`message ${message.role === 'user' ? 'user-message' : 'bot-message'}`}>
//                 <div className="message-content">
//                     {message.role === 'assistant' ? (
//                         <div dangerouslySetInnerHTML={{ __html: marked(message.content) }} />
//                     ) : (
//                         message.content
//                     )}
//                 </div>
//                 <div className="message-time">
//                     {new Date(message.timestamp || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                 </div>
//             </div>
//         );
//     };

//     return (
//         <div className="chatbot-container">
//             <div className="chat-header">
//                 <Space direction="vertical" size="small">
//                     <Title level={2} style={{ color: 'white', margin: 0 }}>🌍 Travel Assistant</Title>
//                     <Text style={{ color: 'white', opacity: 0.8 }}>Ask me anything about travel!</Text>
//                 </Space>
//                 <Button 
//                     icon={<ClearOutlined />} 
//                     onClick={clearChat}
//                     className="clear-button"
//                 >
//                     Clear Chat
//                 </Button>
//             </div>

//             {error && (
//                 <div className="error-message">
//                     <Text type="danger">{error}</Text>
//                 </div>
//             )}

//             <div className="chat-messages" ref={chatContainerRef}>
//                 {messages.length === 0 ? (
//                     <div className="welcome-message">
//                         <Title level={3}>Welcome to Travel Assistant!</Title>
//                         <Text>I can help you with:</Text>
//                         <Divider />
//                         <Row gutter={[16, 16]}>
//                             {Object.entries(suggestions).map(([category, items]) => (
//                                 <Col span={8} key={category}>
//                                     <Card 
//                                         title={
//                                             <Space>
//                                                 {items[0].icon}
//                                                 {category.charAt(0).toUpperCase() + category.slice(1)}
//                                             </Space>
//                                         }
//                                         className="suggestion-card"
//                                         bodyStyle={{ padding: 0 }}
//                                     >
//                                         <List
//                                             dataSource={items}
//                                             renderItem={(item) => (
//                                                 <List.Item 
//                                                     className="suggestion-item"
//                                                     style={{ cursor: 'pointer', padding: '16px' }}
//                                                     onClick={() => useSuggestion(item.text)}
//                                                 >
//                                                     <Space>
//                                                         {item.icon}
//                                                         {item.text}
//                                                     </Space>
//                                                 </List.Item>
//                                             )}
//                                         />
//                                     </Card>
//                                 </Col>
//                             ))}
//                         </Row>
//                         {recentSearches.length > 0 && (
//                             <>
//                                 <Divider />
//                                 <Title level={4}>
//                                     <HistoryOutlined /> Recent Searches
//                                 </Title>
//                                 <Space wrap>
//                                     {recentSearches.map((search, index) => (
//                                         <Tag 
//                                             key={index}
//                                             onClick={() => useSuggestion(search)}
//                                             className="recent-search-tag"
//                                         >
//                                             {search}
//                                         </Tag>
//                                     ))}
//                                 </Space>
//                             </>
//                         )}
//                     </div>
//                 ) : (
//                     messages.map((message, index) => (
//                         <div key={index}>
//                             {renderMessage(message)}
//                         </div>
//                     ))
//                 )}
//                 {isTyping && (
//                     <div className="typing-indicator">
//                         <div className="dot"></div>
//                         <div className="dot"></div>
//                         <div className="dot"></div>
//                     </div>
//                 )}
//             </div>

//             <div className="chat-input">
//                 <AutoComplete
//                     options={Object.values(suggestions).flat().map(item => ({
//                         value: item.text,
//                         label: (
//                             <Space>
//                                 {item.icon}
//                                 {item.text}
//                             </Space>
//                         )
//                     }))}
//                     style={{ width: '100%' }}
//                     onSelect={(value) => setInputMessage(value)}
//                     value={inputMessage}
//                     onChange={(value) => setInputMessage(value)}
//                     placeholder="Ask about travel, weather, or hotels..."
//                 >
//                     <Input
//                         size="large"
//                         suffix={
//                             <Button 
//                                 type="primary" 
//                                 icon={<SendOutlined />}
//                                 onClick={sendMessage}
//                                 loading={isTyping}
//                             >
//                                 Send
//                             </Button>
//                         }
//                         onPressEnter={sendMessage}
//                     />
//                 </AutoComplete>
//             </div>
//         </div>
//     );
// };

// export default ChatbotReact;








import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { marked } from 'marked';
import { 
  Input, Button, Card, Space, Typography, Avatar, 
  List, Tag, AutoComplete, message, Divider, Row, Col 
} from 'antd';
import { 
  SendOutlined, ClearOutlined, 
  EnvironmentOutlined, CloudOutlined, 
  HomeOutlined, HistoryOutlined 
} from '@ant-design/icons';
import './ChatbotReact.css';

const { Title, Text } = Typography;
const { Search } = Input;
const BACKEND_URL = 'http://localhost:5000';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    type?: 'weather' | 'direction' | 'distance' | 'nearby' | 'places' | 'gemini' | 'error';
    data?: any;
    timestamp?: string;
}

const ChatbotReact: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState<string>('');
    const [isTyping, setIsTyping] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const suggestions = {
        weather: [
            { text: "What's the weather in Chennai?", icon: <CloudOutlined /> },
            { text: "Is it raining in Madurai?", icon: <CloudOutlined /> },
            { text: "How hot is it in Coimbatore?", icon: <CloudOutlined /> }
        ],
        places: [
            { text: "Show me hotels in Kodaikanal", icon: <HomeOutlined /> },
            { text: "Find restaurants in Ooty", icon: <HomeOutlined /> },
            { text: "What are the best attractions in Thanjavur?", icon: <HomeOutlined /> }
        ],
        directions: [
            { text: "How do I get from Chennai to Rameswaram?", icon: <EnvironmentOutlined /> },
            { text: "Directions from Madurai to Kanyakumari", icon: <EnvironmentOutlined /> },
            { text: "Show me the route from Coimbatore to Ooty", icon: <EnvironmentOutlined /> }
        ]
    };

    useEffect(() => { loadChatHistory(); checkHealth(); }, []);
    useEffect(() => { scrollToBottom(); }, [messages]);

    const scrollToBottom = () => {
        chatContainerRef.current?.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
    };

    const loadChatHistory = async () => {
        try {
            const res = await fetch(`${BACKEND_URL}/chat/history`);
            const data = await res.json();
            setMessages(data.messages || []);
        } catch (err) {
            console.error(err);
            setError('Failed to load chat history.');
        }
    };

    const checkHealth = async () => {
        try {
            const res = await fetch(`${BACKEND_URL}/health`);
            const data = await res.json();
            if (data.status !== 'ok') setError('Server unhealthy.');
        } catch {
            setError('Cannot connect to server.');
        }
    };

    // Helper extractors
    const extractCity = (text: string) => {
        const cities = ['Salem','Chennai','Mumbai','Delhi','New York','London','Tokyo','Paris'];
        for (let city of cities) if (text.toLowerCase().includes(city.toLowerCase())) return city;
        return 'Salem';
    };

    const extractOriginDestination = (text: string) => {
        const cities = ['Salem','Chennai','Mumbai','Delhi','New York','London','Tokyo','Paris'];
        const found = cities.filter(c => text.toLowerCase().includes(c.toLowerCase()));
        return { origin: found[0] || 'Salem', destination: found[1] || 'Chennai' };
    };

    const extractNearbyType = (text: string) => {
        let type = 'restaurant';
        if (text.includes('hotel')) type = 'lodging';
        else if (text.includes('bank')) type = 'bank';
        else if (text.includes('atm')) type = 'atm';
        else if (text.includes('petrol')) type = 'gas_station';
        else if (text.includes('attraction')) type = 'tourist_attraction';
        return type;
    };

    const sendMessage = async (e: FormEvent) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        const userMsg: Message = { role: 'user', content: inputMessage, timestamp: new Date().toISOString() };
        setMessages(prev => [...prev, userMsg]);
        setInputMessage(''); setIsTyping(true); setError(null);

        try {
            const lower = inputMessage.toLowerCase();
            let res, result, botMsg: Message;

            if (lower.includes('weather')) {
                const city = extractCity(inputMessage);
                res = await fetch(`${BACKEND_URL}/weather?city=${encodeURIComponent(city)}`);
                result = await res.json();
                botMsg = {
                    role: 'assistant', type: 'weather', data: result,
                    content: `Weather in ${result.city}: ${result.temp}°C, ${result.description}`,
                    timestamp: new Date().toISOString()
                };

            } else if (lower.includes('direction') || lower.includes('route') || lower.includes('how to get')) {
                const { origin, destination } = extractOriginDestination(inputMessage);
                res = await fetch(`${BACKEND_URL}/directions?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`);
                result = await res.json();
                botMsg = {
                    role: 'assistant', type: 'direction', data: result,
                    content: `Directions from ${origin} to ${destination}`,
                    timestamp: new Date().toISOString()
                };

            } else if (lower.includes('distance')) {
                const { origin, destination } = extractOriginDestination(inputMessage);
                res = await fetch(`${BACKEND_URL}/distance?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`);
                result = await res.json();
                botMsg = {
                    role: 'assistant', type: 'distance', data: result,
                    content: `Distance: ${result.distance.text}, Duration: ${result.duration.text}`,
                    timestamp: new Date().toISOString()
                };

            } else if (lower.includes('nearby') || lower.includes('show')) {
                const type = extractNearbyType(inputMessage);
                const lat = 11.6643, lng = 78.1460;
                res = await fetch(`${BACKEND_URL}/places/nearby?lat=${lat}&lng=${lng}&type=${type}`);
                result = await res.json();
                botMsg = {
                    role: 'assistant', type: 'nearby', data: result.places,
                    content: `Nearby ${type}`, timestamp: new Date().toISOString()
                };

            } else if (lower.includes('place') || lower.includes('hotel') || lower.includes('restaurant') || lower.includes('attraction')) {
                const city = extractCity(inputMessage);
                res = await fetch(`${BACKEND_URL}/places/search?city=${encodeURIComponent(city)}`);
                result = await res.json();
                botMsg = {
                    role: 'assistant', type: 'places', data: result.places,
                    content: `Places in ${city}`, timestamp: new Date().toISOString()
                };

            } else {
                res = await fetch(`${BACKEND_URL}/ask`, {
                    method: 'POST', headers: {'Content-Type':'application/json'},
                    body: JSON.stringify({ prompt: inputMessage })
                });
                result = await res.json();
                botMsg = {
                    role: 'assistant', type: result.type, data: result.data,
                    content: result.message, timestamp: new Date().toISOString()
                };
            }

            setIsTyping(false);
            setMessages(prev => [...prev, botMsg]);

        } catch (err) {
            console.error(err);
            const msg = err instanceof Error ? err.message : 'Failed to send message';
            setIsTyping(false); setError(msg);
            setMessages(prev => [...prev, { role:'assistant', content:`Error: ${msg}`, type:'error', timestamp:new Date().toISOString()}]);
        }
    };

    const clearChat = () => { setMessages([]); setError(null); };
    const useSuggestion = (text: string) => setInputMessage(text);

    const renderMessage = (message: Message) => {
        if (message.role === 'assistant') {
            switch (message.type) {
                case 'weather':
                    return (
                        <Card className="message-card">
                            <Card.Meta
                                avatar={<Avatar src={message.data.icon} />}
                                title={`Weather in ${message.data.city}`}
                                description={<Text>{message.data.temp}°C, {message.data.description}</Text>}
                            />
                        </Card>
                    );
                case 'direction':
                    return (
                        <Card className="message-card">
                            <List
                                dataSource={message.data.steps}
                                renderItem={(step: string, i: number) => (
                                    <List.Item key={i}><div dangerouslySetInnerHTML={{ __html: step }} /></List.Item>
                                )}
                            />
                        </Card>
                    );
                case 'distance':
                    return (
                        <Card className="message-card">
                            <Card.Meta
                                title={`Distance from ${message.data.origin} to ${message.data.destination}`}
                                description={<div><Text>{message.data.distance.text}</Text><br /><Text>{message.data.duration.text}</Text></div>}
                            />
                        </Card>
                    );
                case 'nearby':
                case 'places':
                    if (Array.isArray(message.data)) {
                        return (
                            <Card className="message-card">
                                <List
                                    dataSource={message.data}
                                    renderItem={(place: any) => (
                                        <List.Item>
                                            <Card.Meta
                                                avatar={place.photo && <Avatar src={place.photo} />}  
                                                title={place.name}
                                                description={<Space direction="vertical"><Text>{place.address}</Text><Tag>Rating: {place.rating}</Tag></Space>}
                                            />
                                        </List.Item>
                                    )}
                                />
                            </Card>
                        );
                    }
                    break;
            }
        }
        return (
            <div className={`message ${message.role === 'user' ? 'user-message' : 'bot-message'}`}>
                <div className="message-content">
                    {message.role === 'assistant' ? <div dangerouslySetInnerHTML={{ __html: marked(message.content) }} /> : message.content}
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
                <Space direction="vertical" size="small">
                    <Title level={2} style={{ color: 'white', margin: 0 }}>🌍 Travel Assistant</Title>
                    <Text style={{ color: 'white', opacity: 0.8 }}>Ask me anything about travel!</Text>
                </Space>
                <Button icon={<ClearOutlined />} onClick={clearChat} className="clear-button">Clear Chat</Button>
            </div>

            {error && <div className="error-message"><Text type="danger">{error}</Text></div>}

            <div className="chat-messages" ref={chatContainerRef}>
                {messages.length === 0 ? (
                    <div className="welcome-message">
                        <Title level={3}>Welcome to Travel Assistant!</Title>
                        <Text>I can help you with:</Text>
                        <Divider />
                        <Row gutter={[16, 16]}>
                            {Object.entries(suggestions).map(([category, items]) => (
                                <Col span={8} key={category}>
                                    <Card title={<Space>{items[0].icon}{category.charAt(0).toUpperCase()+category.slice(1)}</Space>} className="suggestion-card">
                                        <List dataSource={items} renderItem={item => (
                                            <List.Item className="suggestion-item" onClick={() => useSuggestion(item.text)}>
                                                <Space>{item.icon}{item.text}</Space>
                                            </List.Item>
                                        )} />
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                        {recentSearches.length > 0 && (
                            <>
                                <Divider /><Title level={4}><HistoryOutlined /> Recent Searches</Title>
                                <Space wrap>{recentSearches.map((s,i)=><Tag key={i} onClick={()=>useSuggestion(s)} className="recent-search-tag">{s}</Tag>)}</Space>
                            </>
                        )}
                    </div>
                ) : (
                    messages.map((msg, idx) => <div key={idx}>{renderMessage(msg)}</div>)
                )}
                {isTyping && <div className="typing-indicator"><div className="dot"/><div className="dot"/><div className="dot"/></div>}
            </div>

            <div className="chat-input">
                <AutoComplete
                    options={Object.values(suggestions).flat().map(item => ({ value: item.text, label: <Space>{item.icon}{item.text}</Space> }))}
                    style={{ width: '100%' }}
                    onSelect={value => setInputMessage(value)}
                    value={inputMessage}
                    onChange={value => setInputMessage(value)}
                    placeholder="Ask about travel, weather, or hotels..."
                >
                    <Input size="large" suffix={<Button type="primary" icon={<SendOutlined />} onClick={sendMessage} loading={isTyping}>Send</Button>} onPressEnter={sendMessage} />
                </AutoComplete>
            </div>
        </div>
    );
};

export default ChatbotReact;
