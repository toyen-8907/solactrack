import React, { useState, useCallback } from 'react';
import './App.css';
import WebSocketComponent from './WebSocketComponent';

const App: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<string>("Disconnected");
  const [messages, setMessages] = useState<string[]>([]);
  const account = "HdhqEd7sfmeTS5dyi17TRymLhEy7kxz8MhKp9CzkB28U"; // 需要訂閱的帳戶地址
//GzErnv5yVV6n8yQk43ZWNuwvXoGhxrGDXTs2yvv5jW1b
  const handleConnectionStatus = useCallback((status: string) => {
    setConnectionStatus(status);
  }, []);

  // 處理新消息的函數
  const handleNewMessage = useCallback((message: string) => {
    setMessages(prevMessages => [...prevMessages, message]); // 更新消息狀態
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h2>WebSocket Status: {connectionStatus}</h2>
      </header> 
      <WebSocketComponent 
        onConnectionStatus={handleConnectionStatus} 
        account={account} 
        onMessageReceived={handleNewMessage} // 傳遞回調
      />
      <div className='dashboard'>
        <h3>Received Messages:</h3>
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>{msg}</li> // 顯示接收到的消息
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
