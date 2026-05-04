// src/components/AIAssistant.tsx
import { useState } from "react";
import "./AIAssistant.css";

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const knowledgeBase: { [key: string]: string } = {
  "exam": "📝 Start preparing at least 2 weeks before. Solve past papers and focus on weak topics.",
  "exam tips": "📚 Review your notes daily, get enough sleep before the exam!",
  "study": "🎯 Study for 45 minutes, then take a 10-minute break.",
  "study method": "💡 Try the Pomodoro Technique: 25 min study + 5 min break.",
  "homework": "✏️ Break your homework into small tasks. Start with the hardest one first.",
  "math": "➕ Practice daily, memorize formulas, and solve different types of problems.",
  "physics": "⚡ Understand the concepts behind formulas. Draw diagrams to visualize problems.",
  "english": "📖 Read books, watch movies with subtitles, and practice speaking every day.",
  "time management": "⏰ Create a weekly schedule, prioritize tasks, and avoid multitasking.",
  "motivation": "💪 Set small achievable goals, reward yourself after completing tasks!",
  "grades": "📊 Track your grades regularly, identify weak subjects, and focus on improving them.",
  "hello": "👋 Hello! I'm your AI Study Assistant. Ask me about exams, homework, study tips!",
  "help": "🤝 I can help with: exam preparation, study methods, homework tips, time management!",
};

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "👋 Hello! I'm your AI Study Assistant. Ask me anything about studying!",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    for (const [key, response] of Object.entries(knowledgeBase)) {
      if (lowerMessage.includes(key)) {
        return response;
      }
    }
    
    return "🤔 Try asking about: exams, study methods, homework, math, physics, motivation, or time management!";
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const aiResponseText = getAIResponse(input);
      const aiMessage: Message = {
        id: messages.length + 2,
        text: aiResponseText,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="ai-assistant-card">
      <div className="ai-header">
        <div className="ai-header-left">
          <span className="ai-icon">🤖</span>
          <div>
            <h3>AI Study Assistant</h3>
            <p>Online • Ready to help</p>
          </div>
        </div>
        <div className="ai-status">
          <span className="status-dot"></span>
        </div>
      </div>

      <div className="ai-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.isUser ? "user-message" : "ai-message"}`}>
            <div className="message-avatar">{msg.isUser ? "👤" : "🤖"}</div>
            <div className="message-bubble">
              <p>{msg.text}</p>
              <span className="message-time">{formatTime(msg.timestamp)}</span>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="typing-indicator">
            <div className="message-avatar">🤖</div>
            <div className="typing-bubble">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
      </div>

      <div className="ai-input-area">
        <input
          type="text"
          placeholder="Ask me anything about studying..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={handleSendMessage} disabled={!input.trim()}>Send</button>
      </div>
      
      <div className="ai-suggestions">
        <span>Suggestions:</span>
        <button onClick={() => setInput("exam tips")}>📝 Exam tips</button>
        <button onClick={() => setInput("study method")}>📚 Study method</button>
        <button onClick={() => setInput("motivation")}>💪 Motivation</button>
        <button onClick={() => setInput("time management")}>⏰ Time management</button>
      </div>
    </div>
  );
}