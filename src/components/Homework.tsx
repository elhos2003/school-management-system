import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import "./Homework.css";

interface HomeworkItem {
  id: number;
  subject: string;
  description: string;
  dueDate: string;
  file?: string;
}

export default function Homework() {
  const [homework, setHomework] = useState<HomeworkItem[]>([
    {
      id: 1,
      subject: "Math",
      description: "Solve exercises page 25",
      dueDate: "Tomorrow",
    },
    {
      id: 2,
      subject: "Physics",
      description: "Write report about motion",
      dueDate: "Next Week",
    },
  ]);

  const [selectedHW, setSelectedHW] = useState<HomeworkItem | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [userName, setUserName] = useState("Ahmed");

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) setUserName(currentUser);
  }, []);

  const handleFileUpload = (id: number, file: File | null) => {
    if (!file) return;

    const updated = homework.map(hw =>
      hw.id === id ? { ...hw, file: file.name } : hw
    );

    setHomework(updated);
  };

  return (
    
    <div className="dashboard-layout">
      <Sidebar activePage="homework" />

      <main className="main-content">
        {/* Header */}
        <header className="dashboard-header">
          <h1>Hello, {userName}</h1>
        </header>
        {/* Homework Grid */}
        <div className="homework-grid">
          {homework.map(hw => (
            <div key={hw.id} className="hw-card">
              <h3>{hw.subject}</h3>
              <p>{hw.description}</p>
              <span className="due">Due: {hw.dueDate}</span>

              {/* Upload Button */}
              <label className="upload-btn">
                📎 Upload File
                <input
                  type="file"
                  hidden
                  onChange={(e) =>
                    handleFileUpload(hw.id, e.target.files?.[0] || null)
                  }
                />
              </label>

              {hw.file && (
                <span className="file-name">✅ {hw.file}</span>
              )}

              <button
                className="view-btn"
                onClick={() => {
                  setSelectedHW(hw);
                  setShowModal(true);
                }}
              >
                View
              </button>
            </div>
          ))}
        </div>

        {/* Modal */}
        {showModal && selectedHW && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2>{selectedHW.subject}</h2>
              <p>{selectedHW.description}</p>
              <p className="due">Due: {selectedHW.dueDate}</p>

              {selectedHW.file ? (
                <p className="file-name">📄 {selectedHW.file}</p>
              ) : (
                <p>No file uploaded</p>
              )}

              <button
                className="close-btn"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}