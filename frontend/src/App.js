// import React, { useState, useRef, useEffect } from 'react';
// import './style.css'; // Ensure this matches your CSS file name

// const App = () => {
//   // App State
//   const [screen, setScreen] = useState('landing'); // 'landing' or 'dashboard'
  
//   // RAG & Chat State
//   const [messages, setMessages] = useState([]);
//   const [inputText, setInputText] = useState('');
//   const [isKnowledgeBaseMode, setIsKnowledgeBaseMode] = useState(true);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [errorText, setErrorText] = useState('');

//   const chatEndRef = useRef(null);

//   // Auto-scroll to bottom of chat
//   useEffect(() => {
//     if (chatEndRef.current) {
//       chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
//     }
//   }, [messages, isLoading]);

//   // --- Handlers ---
//   const handleLogin = () => setScreen('dashboard');

//   const handleFileChange = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     setSelectedFile(file.name);
//     setErrorText('');

//     // RAG: Mock POST request to /upload
//     try {
//       setIsLoading(true);
//       // Replace with your real backend call:
//       // const formData = new FormData(); formData.append("file", file);
//       // await fetch('https://api.yourdomain.com/upload', { method: 'POST', body: formData });
      
//       await new Promise(res => setTimeout(res, 1500)); // Simulating network delay
      
//       setMessages(prev => [...prev, { sender: 'ai', text: `System: Successfully uploaded and processed ${file.name}. You can now query this document.` }]);
//     } catch (err) {
//       setErrorText('Failed to upload document.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSend = async () => {
//     if (!inputText.trim()) return;

//     const userMessage = inputText;
//     setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
//     setInputText('');
//     setErrorText('');
//     setIsLoading(true);

//     // RAG: Mock POST request to /query
//     try {
//       const mode = isKnowledgeBaseMode ? "knowledge_base" : "document";
//       const payload = { query: userMessage, mode: mode };

//       // Replace with your real backend call:
//       // const response = await fetch('https://api.yourdomain.com/query', {
//       //   method: 'POST',
//       //   headers: { 'Content-Type': 'application/json' },
//       //   body: JSON.stringify(payload)
//       // });
//       // const data = await response.json();

//       await new Promise(res => setTimeout(res, 2000)); // Simulating AI processing time
      
//       const mockResponse = mode === 'knowledge_base' 
//         ? `Based on our global knowledge base, here is the answer to: "${userMessage}".`
//         : `Looking specifically at your uploaded document (${selectedFile || 'None'}), here is the answer: "${userMessage}".`;

//       setMessages(prev => [...prev, { sender: 'ai', text: mockResponse }]);
//     } catch (err) {
//       setErrorText('Failed to fetch response. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // --- UI Renders ---
  
//   const renderLanding = () => (
//     <div className="screen">
//       <div className="landing-content">
//         <div className="orb-container">
//           <div className="orb">✨</div>
//         </div>
//         <h1 className="landing-title">Ask<br/>anything</h1>
//         <p className="landing-subtitle">Spark brilliance<br/>let AI elevate your craft.</p>
        
//         <div className="auth-buttons">
//           <button className="btn" onClick={handleLogin}>Sign Up</button>
//           <button className="btn" onClick={handleLogin}>Sign In</button>
//         </div>
//       </div>
//     </div>
//   );

//   const renderDashboard = () => (
//     <div className="screen">
      
//       {/* Header */}
//       <div className="dashboard-header">
//         <div className="profile-section">
//           <div className="avatar">👨🏽‍💻</div>
//           <span className="greeting">Hi, Bayzid</span>
//         </div>
//         <button className="icon-btn">🔔</button>
//       </div>

//       {messages.length === 0 && (
//         <>
//           <p className="dashboard-subtitle">Control tasks effortlessly, from creating visuals to organizing your calendar.</p>
//           <div className="orb-container"><div className="orb small">✨</div></div>
          
//           {/* Feature Cards Grid */}
//           <div className="feature-grid">
//             <div className="feature-card glass-card card-speak" onClick={() => setInputText("Let's speak...")}>
//               <div className="card-icon">🎙️</div>
//               <div className="card-title">Speak<br/>with AI</div>
//             </div>
//             <div className="feature-card glass-card card-chat" onClick={() => document.getElementById('chat-input').focus()}>
//               <div className="card-icon">💬</div>
//               <div className="card-title">Chat<br/>with AI</div>
//             </div>
//             <div className="feature-card glass-card card-gen" onClick={() => setInputText("Generate an image of...")}>
//               <div className="card-icon">🖼️</div>
//               <div className="card-title">Generate<br/>Images</div>
//             </div>
//             <div className="feature-card glass-card card-scan">
//               <div className="card-icon">🔍</div>
//               <div className="card-title">Scan to<br/>Search</div>
//             </div>
//           </div>
//         </>
//       )}

//       {/* Chat Area */}
//       {messages.length > 0 && (
//         <div className="chat-area">
//           {messages.map((msg, idx) => (
//             <div key={idx} className={`message ${msg.sender === 'user' ? 'msg-user' : 'msg-ai'}`}>
//               {msg.text}
//             </div>
//           ))}
//           {isLoading && (
//             <div className="message msg-ai typing-indicator">
//               <div className="dot"></div><div className="dot"></div><div className="dot"></div>
//             </div>
//           )}
//           {errorText && <div style={{color: '#ff4d4d', fontSize: '0.8rem', alignSelf: 'center'}}>{errorText}</div>}
//           <div ref={chatEndRef} />
//         </div>
//       )}

//       {/* Input & RAG Controls Layer */}
//       <div className="input-container">
        
//         {/* RAG Tools: File Upload & Mode Toggle */}
//         <div className="rag-controls">
//           <div className="upload-btn-wrapper">
//             <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
//               📎 {selectedFile ? (selectedFile.length > 15 ? selectedFile.substring(0, 15) + '...' : selectedFile) : 'Upload Doc'}
//             </span>
//             <input type="file" onChange={handleFileChange} accept=".pdf,.txt,.docx" />
//           </div>

//           <label className="toggle-switch">
//             <input 
//               type="checkbox" 
//               style={{ display: 'none' }} 
//               checked={isKnowledgeBaseMode} 
//               onChange={() => setIsKnowledgeBaseMode(!isKnowledgeBaseMode)} 
//             />
//             <span className="toggle-slider"></span>
//             <span>KB Mode</span>
//           </label>
//         </div>

//         {/* Text Input */}
//         <div className="input-bar">
//           <input 
//             id="chat-input"
//             type="text" 
//             placeholder="Ask anything" 
//             value={inputText}
//             onChange={(e) => setInputText(e.target.value)}
//             onKeyDown={(e) => e.key === 'Enter' && handleSend()}
//             disabled={isLoading}
//           />
//           <button className="send-btn" onClick={handleSend} disabled={isLoading || !inputText.trim()}>
//             ✨
//           </button>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <>
//       <div className="ambient-glow glow-top"></div>
//       <div className="ambient-glow glow-bottom"></div>
//       <div className="app-container">
//         {screen === 'landing' ? renderLanding() : renderDashboard()}
//       </div>
//     </>
//   );
// };

// export default App;



import React, { useState, useRef, useEffect } from 'react';
import './style.css';

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const App = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage = inputText;

    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userMessage })
      });

      const data = await res.json();

      setMessages(prev => [
        ...prev,
        { sender: 'ai', text: data.answer || "No response" }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { sender: 'ai', text: "⚠️ Backend not reachable" }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setInputText('');
  };

  return (
    <div className="app-wrapper">

      {/* Glow */}
      <div className="ambient-glow glow-top"></div>
      <div className="ambient-glow glow-bottom"></div>

      {/* Sidebar */}
      <div className="sidebar">
        <h2 className="logo">CortexRAG</h2>

        <button className="new-chat" onClick={handleNewChat}>
          + New Chat
        </button>

        <div className="features">
          <div className="feature">📄 Multi-Document RAG</div>
          <div className="feature">⚡ Hybrid Retrieval</div>
          <div className="feature">🧠 Query Expansion</div>
          <div className="feature">🎯 Context-Aware Answers</div>
        </div>
      </div>

      {/* Main */}
      <div className="main">

        {/* CONTENT WRAPPER (IMPORTANT) */}
        <div className="content">

          {messages.length === 0 ? (

            <div className="empty">
              <div className="orb">
                <span>✨</span>
              </div>
              <h1>Ask anything</h1>
              <p>Your AI knowledge assistant powered by RAG</p>
            </div>

          ) : (

            <div className="chat">
              {messages.map((msg, i) => (
                <div key={i} className={`msg ${msg.sender}`}>
                  {msg.text}
                </div>
              ))}

              {isLoading && (
                <div className="msg ai typing">
                  <span></span><span></span><span></span>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

          )}

        </div>

        {/* INPUT WRAPPER (CRITICAL FIX) */}
        <div className="input-wrapper">
          <div className="input-bar">
            <input
              type="text"
              placeholder="Ask anything..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend} className='send-btn'>✨</button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default App;