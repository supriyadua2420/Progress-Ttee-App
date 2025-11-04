import React from "react";

const TreeNode = ({ node, isSelected, onClick, size = 100, isEditing, onStartEditing, onFinishEditing }) => {
  const [tempLabel, setTempLabel] = React.useState(node.label);
  const style = {
    position: "absolute",
    left: `${node.x - size / 2}px`,
    top: `${node.y - size / 2}px`,
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: "50%",
    background: isSelected
      ? "linear-gradient(135deg, #a29bfe, #81ecec)"
      : "linear-gradient(135deg, #dfe6e9, #b2bec3)",
    border: "2px solid rgba(255,255,255,0.6)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#2d3436",
    fontWeight: "600",
    cursor: "grab",
    boxShadow: isSelected
      ? "0 0 15px rgba(162, 155, 254, 0.8)"
      : "0 2px 8px rgba(0,0,0,0.15)",
    transition: "all 0.25s ease",
    userSelect: "none",
  };

  return (
    <div style={style} 
        onMouseDown={(e) => onClick(e, node)}
        onDoubleClick={onStartEditing}>

      {isEditing ? (
        <input
          type="text"
          value={tempLabel}
          onChange={(e) => setTempLabel(e.target.value)}
          onBlur={() => onFinishEditing(tempLabel)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onFinishEditing(tempLabel);
            }
          }}
          autoFocus
          style={{
            width: "80%",
            border: "none",
            borderRadius: "8px",
            textAlign: "center",
            outline: "none",
            fontSize: "14px",
          }}
        />
      ) : (
        node.label
      )}
    </div>
  );
};

export default TreeNode;
