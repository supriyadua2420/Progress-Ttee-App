import React, { useRef, useState } from "react";
import TreeNode from "./TreeNode.jsx";

const initialNodes = [
  { id: 1, label: "1", x: 400, y: 100, parentId: null },
  { id: 2, label: "2", x: 250, y: 250, parentId: 1 },
  { id: 3, label: "3", x: 550, y: 250, parentId: 1 },
  { id: 4, label: "4", x: 200, y: 400, parentId: 2 },
  { id: 5, label: "5", x: 300, y: 400, parentId: 2 },
];

export default function TreeCanvas() {
  const containerRef = useRef(null);
  const [nodes, setNodes] = useState(initialNodes);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [draggingNode, setDraggingNode] = useState(null);

  const handleMouseDown = (e, node) => {
    setSelectedNodeId(node);
    setDraggingNode(node);
  };

  const handleMouseMove = (e) => {
    if (!draggingNode) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setNodes((prev) =>
      prev.map((n) => (n.id === draggingNode.id ? { ...n, x, y } : n))
    );
  };

  const handleMouseUp = () => setDraggingNode(null);

  const handleAddNode = () => {
    setNodes((prev) => {
      const newId = prev.length ? Math.max(...prev.map((n) => n.id)) + 1 : 1;
      const parent = selectedNodeId || prev[0];
      const offsetX = Math.random() * 150 - 75;
      const offsetY = 150;
      const newNode = {
        id: newId,
        label: `${newId}`,
        x: parent.x + offsetX,
        y: parent.y + offsetY,
        parentId: parent.id,
      };
      return [...prev, newNode];
    });
  };

  const handleDeleteNode = () => {
    if (!selectedNodeId) return;

    const parentId = selectedNodeId.parentId;

    const children = nodes.filter(n => n.parentId === selectedNodeId.id);
    children.forEach(child => child.parentId = parentId);

    const updateNodes = nodes.filter(n => n.id !== selectedNodeId.id);
    setNodes(updateNodes);
    setSelectedNodeId(null);

  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        textAlign: "center",
        position: "relative",
      }}
    >
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{
          width: "100%",
          height: "85vh",
          position: "relative",
          background: "linear-gradient(135deg, #f8f9fa 0%, #f1f3f6 100%)",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "inset 0 0 20px rgba(0,0,0,0.05)",
        }}
      >
        <svg
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            top: 0,
            left: 0,
            pointerEvents: "none",
          }}
        >
          <defs>
            <linearGradient id="edgeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#74b9ff" />
              <stop offset="100%" stopColor="#a29bfe" />
            </linearGradient>
          </defs>

          {nodes.map((node) => {
            if (!node.parentId) return null;
            const parent = nodes.find((n) => n.id === node.parentId);
            if (!parent) return null;
            return (
              <line
                key={`${parent.id}-${node.id}`}
                x1={parent.x}
                y1={parent.y}
                x2={node.x}
                y2={node.y}
                stroke="url(#edgeGradient)"
                strokeWidth="3"
                opacity="0.9"
                style={{ transition: "all 0.3s ease" }}
              />
            );
          })}
        </svg>

        {nodes.map((node) => (
          <TreeNode
            key={node.id}
            node={node}
            size={50}
            isSelected={selectedNodeId && selectedNodeId.id === node.id}
            onClick={handleMouseDown}
          />
        ))}
      </div>


      {/* 🌸 Floating Button Group */}
    <div
      style={{
        position: "absolute",
        bottom: "30px",
        right: "30px",
        display: "flex",
        gap: "12px", // space between buttons
        zIndex: 10,
      }}
    >
      {/* ➕ Add Node Button */}
      <button
        onClick={handleAddNode}
        style={{
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          border: "none",
          background: "linear-gradient(135deg, #ffb6c1, #ff9a9e)",
          color: "white",
          fontSize: "30px",
          lineHeight: "0",
          fontWeight: "bold",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          transition: "all 0.3s ease",
        }}
        onMouseOver={(e) => {
          e.target.style.transform = "scale(1.1)";
          e.target.style.boxShadow = "0 6px 18px rgba(255,154,158,0.5)";
        }}
        onMouseOut={(e) => {
          e.target.style.transform = "scale(1)";
          e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
        }}
      >
        +
      </button>

      {/* 🩷 Delete Node Button */}
      <button
        onClick={handleDeleteNode}
        style={{
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          border: "none",
          background: "linear-gradient(135deg, #ffb6c1, #ff9a9e)", // same as Add
          color: "white",
          fontSize: "26px",
          lineHeight: "0",
          fontWeight: "bold",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          transition: "all 0.3s ease",
        }}
        onMouseOver={(e) => {
          e.target.style.transform = "scale(1.1)";
          e.target.style.boxShadow = "0 6px 18px rgba(255,154,158,0.5)";
        }}
        onMouseOut={(e) => {
          e.target.style.transform = "scale(1)";
          e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
        }}
      >
        -
      </button>

    </div>

    </div>
  );
}