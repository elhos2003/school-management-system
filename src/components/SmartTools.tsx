// src/components/SmartTools.tsx
import AIAssistant from "./AIAssistant";
import Sidebar from "./Sidebar";

export default function SmartTools() {
  return (
    <div className="dashboard-layout">
      <Sidebar activePage="smart-tools" />
      <main className="main-content">
        <h1>🤖 AI Study Assistant</h1>
        <AIAssistant />
      </main>
    </div>
  );
}