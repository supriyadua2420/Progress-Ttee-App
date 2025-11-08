import React, { useRef, useState, useEffect } from "react";
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
  const [nodes, setNodes] = useState(initialNodes ?? []);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [draggingNode, setDraggingNode] = useState(null);
  const [editingNodeId, setEditingNodeId] = useState(null);

  useEffect(() => {
    const fetchNodes = async () => {
      try {

        const res = await fetch("http://localhost:8000/nodes");
        const data = await res.json();
        const formatted = data.map( n => ({
          id: Number(n.id),
          label: n.label,
          parentId : n.parent_id ? Number(n.parent_id) : null,
          x: n.x ?? Math.random() * 800,
          y: n.y ?? Math.random() * 600,
        }));
        setNodes(formatted);

      } catch (error) {
        console.error("Error fetching nodes:", error);
      }
    };

    fetchNodes();

  }, []);

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
  const newId = nodes.length ? Math.max(...nodes.map((n) => n.id)) + 1 : 1;
  const parent = selectedNodeId
    ? nodes.find((n) => n.id === selectedNodeId.id)
    : nodes[0];

  const offsetX = Math.random() * 150 - 75;
  const offsetY = 150;

  const newNode = {
    id: newId,
    label: `${newId}`,
    x: parent ? parent.x + offsetX : 400,
    y: parent ? parent.y + offsetY : 100,
    parentId: parent ? parent.id : null,
  };

  // update UI first
  setNodes((prev) => [...prev, newNode]);

  // send POST request
  fetch("http://localhost:8000/nodes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: String(newNode.id),
      label: newNode.label,
      parent_id: newNode.parentId !== null ? String(newNode.parentId) : null,
      // x: newNode.x,
      // y: newNode.y,
    }),
  }).catch((err) => console.error("Error adding node:", err));
};


  const handleDeleteNode = () => {
    if (!selectedNodeId) return;

     fetch(`http://localhost:8000/nodes/${String(selectedNodeId.id)}`, {
      method: "DELETE",
    }).catch((err) => console.error("Error deleting node:", err));

    const parentId = selectedNodeId.parentId;

    const updatedNodes = nodes.map((n) => {
        if(n.parentId === selectedNodeId.id){
          return { ...n, parentId};
       }

       return n;
      }  
    ).filter((n) => n.id !== selectedNodeId.id)

    setNodes(updatedNodes);
    setSelectedNodeId(null);

  };

  const handleRename = (nodeId, newLable) => {
      setNodes((prev) =>
        prev.map((n) => (n.id === nodeId ? {...n, label : newLable} : n))
      );

      setEditingNodeId(null);
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
            size={90}
            isSelected={selectedNodeId && selectedNodeId.id === node.id}
            onClick={handleMouseDown}
            isEditing={editingNodeId === node.id}
            onStartEditing={() => setEditingNodeId(node.id)}
            onFinishEditing={(newLabel) => handleRename(node.id, newLabel)}
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