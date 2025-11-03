import React, { useState } from "react";
import Sidebar from "./components/Sidebar.jsx";
import TreeCanvas from "./components/TreeCanvas.jsx";

export default function App() {
  const [projects, setProjects] = useState([]);
  const [activeProjectId, setActiveProjectId] = useState(null);

  const handleCreateProject = () => {
    const newProject = {
      id: Date.now(),
      name: `Project ${projects.length + 1}`,
      nodes: [
        { id: 1, label: "Root", x: 400, y: 100, parentId: null },
      ],
    };
    setProjects((prev) => [...prev, newProject]);
    setActiveProjectId(newProject.id);
  };

  const handleSelectProject = (id) => setActiveProjectId(id);

  const activeProject = projects.find((p) => p.id === activeProjectId);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        projects={projects}
        onCreateProject={handleCreateProject}
        onSelectProject={handleSelectProject}
        activeProjectId={activeProjectId}
      />
      <div className="flex-1 p-4">
        {activeProject ? (
          <TreeCanvas project={activeProject} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-xl">
            Select or create a project to start
          </div>
        )}
      </div>
    </div>
  );
}
