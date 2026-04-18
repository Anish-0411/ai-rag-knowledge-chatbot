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

const App = () => {
  const [screen, setScreen] = useState('landing');

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState('');

  const chatEndRef = useRef(null);

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // ---------------- LOGIN ----------------
  const handleLogin = () => setScreen('dashboard');

  // ---------------- SEND MESSAGE ----------------
  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage = inputText;

    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setInputText('');
    setErrorText('');
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8000/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ question: userMessage })
      });

      if (!response.ok) throw new Error("Server error");

      const data = await response.json();

      setMessages(prev => [
        ...prev,
        { sender: 'ai', text: data.answer || "No response from AI" }
      ]);

    } catch (err) {
      console.error(err);
      setErrorText("⚠️ Failed to connect to backend");
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------- FILE UPLOAD (UI ONLY) ----------------
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file.name);

    setMessages(prev => [
      ...prev,
      {
        sender: 'ai',
        text: `📄 File "${file.name}" selected (backend upload not connected yet)`
      }
    ]);
  };

  // ---------------- UI ----------------

  const renderLanding = () => (
    <div className="screen">
      <div className="landing-content">
        <div className="orb-container">
          <div className="orb">✨</div>
        </div>
        <h1 className="landing-title">Ask<br />anything</h1>
        <p className="landing-subtitle">
          Spark brilliance<br />let AI elevate your craft.
        </p>

        <div className="auth-buttons">
          <button className="btn" onClick={handleLogin}>Sign Up</button>
          <button className="btn" onClick={handleLogin}>Sign In</button>
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="screen">

      {/* Header */}
      <div className="dashboard-header">
        <div className="profile-section">
          <div className="avatar">👨🏽‍💻</div>
          <span className="greeting">Hi, Sai</span>
        </div>
      </div>

      {/* Empty State */}
      {messages.length === 0 && (
        <>
          <p className="dashboard-subtitle">
            Ask anything using your RAG-powered AI 🚀
          </p>
        </>
      )}

      {/* Chat */}
      <div className="chat-area">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`message ${msg.sender === 'user' ? 'msg-user' : 'msg-ai'}`}
          >
            {msg.text}
          </div>
        ))}

        {isLoading && (
          <div className="message msg-ai typing-indicator">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        )}

        {errorText && (
          <div className="error-text">{errorText}</div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="input-container">

        {/* File Upload */}
        <div className="rag-controls">
          <label className="upload-btn-wrapper">
            📎 {selectedFile || "Upload Doc"}
            <input
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.txt,.docx"
            />
          </label>
        </div>

        {/* Input */}
        <div className="input-bar">
          <input
            type="text"
            placeholder="Ask anything..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isLoading}
          />

          <button
            className="send-btn"
            onClick={handleSend}
            disabled={isLoading || !inputText.trim()}
          >
            ➤
          </button>
        </div>
      </div>

    </div>
  );

  return (
    <>
      <div className="ambient-glow glow-top"></div>
      <div className="ambient-glow glow-bottom"></div>

      <div className="app-container">
        {screen === 'landing' ? renderLanding() : renderDashboard()}
      </div>
    </>
  );
};

export default App;