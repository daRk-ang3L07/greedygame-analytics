import React from "react";

// Props: label (string), selected (boolean), onClick (function)
export function CustomCheckbox({ label, selected, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        border: "1px solid #e0e0e0",
        borderRadius: "6px",
        padding: "8px 16px",
        marginBottom: "8px",
        background: selected ? "#f6f9ff" : "#fff",
        position: "relative",
        minWidth: "120px",
        userSelect: "none",
      }}
    >
      {/* Blue bar indicator */}
      <div
        style={{
          width: "4px",
          height: "24px",
          background: "#1976d2",
          borderRadius: "2px",
          marginRight: "12px",
          visibility: selected ? "visible" : "hidden",
          transition: "visibility 0.2s",
        }}
      />
      {/* Label */}
      <span style={{ fontSize: "15px", color: "#222" }}>{label}</span>
    </div>
  );
}
