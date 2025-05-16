import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAnalytics, fetchApps } from "../redux/analyticsSlice";
import { applyColumnChanges } from "../redux/uiSlice";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const allColumns = {
  date: "Date",
  app: "App",
  clicks: "Clicks",
  requests: "Ad Requests",
  response: "Ad Response",
  impression: "Impression",
  revenue: "Revenue",
  fillRate: "Fill Rate",
  ctr: "CTR",
};

const DraggableColumn = ({ columnKey, label, selected, onClick, index, moveColumn }) => {
  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: "COLUMN",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "COLUMN",
    hover: (item) => {
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;
      moveColumn(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        cursor: selected || columnKey === "date" || columnKey === "app" ? "default" : "pointer",
        border: "1px solid #e0e0e0",
        borderRadius: "6px",
        padding: "8px 12px",
        background: selected ? "#f6f9ff" : "#fff",
        userSelect: "none",
        opacity: isDragging ? 0.5 : 1,
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "4px",
          height: "24px",
          background: "#1976d2",
          borderRadius: "2px",
          marginRight: "12px",
          visibility: selected ? "visible" : "hidden",
        }}
      />
      <span style={{ fontSize: "15px", color: "#222" }}>{label}</span>
    </div>
  );
};

const DatePicker = () => {
  const dispatch = useDispatch();
  const reduxSelectedColumns = useSelector((state) => state.ui.selectedColumns);
  const reduxColumnOrder = useSelector((state) => state.ui.columnOrder);

  const [startDate, setStartDate] = useState("2021-06-01");
  const [endDate, setEndDate] = useState("2021-06-07");
  const [showSettings, setShowSettings] = useState(false);
  const [showDateError, setShowDateError] = useState(false);

  const [localSelectedColumns, setLocalSelectedColumns] = useState(reduxSelectedColumns);
  const [localColumnOrder, setLocalColumnOrder] = useState(reduxColumnOrder);

  const openSettings = () => {
    setLocalSelectedColumns(reduxSelectedColumns);
    setLocalColumnOrder(reduxColumnOrder);
    setShowSettings(true);
  };

  const handleToggleColumn = (columnKey) => {
    if (columnKey === "date" || columnKey === "app") {
      // Don't allow toggling date or app
      return;
    }
    setLocalSelectedColumns((prev) =>
      prev.includes(columnKey)
        ? prev.filter((key) => key !== columnKey)
        : [...prev, columnKey]
    );
  };

  const moveColumn = (dragIndex, hoverIndex) => {
    setLocalColumnOrder((prev) => {
      const updated = [...prev];
      const [removed] = updated.splice(dragIndex, 1);
      updated.splice(hoverIndex, 0, removed);
      return updated;
    });
  };

  const handleApplyChanges = () => {
    // Always include date and app in selected columns
    const enforcedSelectedColumns = Array.from(new Set([...localSelectedColumns, "date", "app"]));
    dispatch(applyColumnChanges({
      selectedColumns: enforcedSelectedColumns,
      columnOrder: localColumnOrder,
    }));
    setShowSettings(false);
  };

  const handleCloseSettings = () => {
    setShowSettings(false);
  };

  const validateDates = (start, end) => {
    if (new Date(start) > new Date(end)) {
      setShowDateError(true);
      return false;
    }
    return true;
  };

  const fetchData = (newStart, newEnd) => {
    dispatch(fetchAnalytics({ startDate: newStart, endDate: newEnd }));
    dispatch(fetchApps());
  };

  const handleStartDateChange = (e) => {
    const newStart = e.target.value;
    setStartDate(newStart);
    if (validateDates(newStart, endDate)) {
      fetchData(newStart, endDate);
    }
  };

  const handleEndDateChange = (e) => {
    const newEnd = e.target.value;
    setEndDate(newEnd);
    if (validateDates(startDate, newEnd)) {
      fetchData(startDate, newEnd);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ padding: "0 8px", boxSizing: "border-box" }}>
        {/* Top bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "8px 0",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          {/* Date Inputs */}
          <div style={{ display: "flex", gap: "12px" }}>
            <input
              type="date"
              value={startDate}
              onChange={handleStartDateChange}
              style={{
                padding: "6px 10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                fontSize: "14px",
                minWidth: "140px",
              }}
            />
            <input
              type="date"
              value={endDate}
              onChange={handleEndDateChange}
              style={{
                padding: "6px 10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                fontSize: "14px",
                minWidth: "140px",
              }}
            />
          </div>

          {/* Settings Button */}
          <button
            onClick={openSettings}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "8px 14px",
              backgroundColor: "white",
              border: "1px solid #ccc",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
              gap: "8px",
              color: "#0d6efd",
              whiteSpace: "nowrap",
            }}
          >
            <i className="fa fa-sliders" aria-hidden="true"></i>
            Settings
          </button>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div
            style={{
              border: "1px solid #dee2e6",
              borderRadius: "6px",
              backgroundColor: "#f9f9f9",
              marginTop: "8px",
              width: "100%",
            }}
          >
            <div
              style={{
                padding: "16px",
                borderBottom: "1px solid #dee2e6",
                fontWeight: "600",
                fontSize: "16px",
                color: "#333",
              }}
            >
              Dimensions and Metrics
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                gap: "12px",
                padding: "16px",
              }}
            >
              {localColumnOrder.map((key, index) => (
                <DraggableColumn
                  key={key}
                  columnKey={key}
                  label={allColumns[key]}
                  selected={localSelectedColumns.includes(key)}
                  onClick={() => {
                    if (key !== "date" && key !== "app") {
                      handleToggleColumn(key);
                    }
                  }}
                  index={index}
                  moveColumn={moveColumn}
                />
              ))}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                padding: "16px",
                borderTop: "1px solid #dee2e6",
                gap: "12px",
              }}
            >
              <button
                onClick={handleCloseSettings}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "transparent",
                  border: "1px solid #0d6efd",
                  borderRadius: "6px",
                  cursor: "pointer",
                  color: "#0d6efd",
                  fontWeight: "500",
                }}
              >
                Close
              </button>
              <button
                onClick={handleApplyChanges}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#0d6efd",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  color: "white",
                  fontWeight: "600",
                }}
              >
                Apply Changes
              </button>
            </div>
          </div>
        )}

        {/* Date Error Modal */}
        {showDateError && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 9999,
            }}
            onClick={() => setShowDateError(false)}
          >
            <div
              style={{
                backgroundColor: "#fff",
                padding: "20px 30px",
                borderRadius: "10px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                textAlign: "center",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 style={{ color: "#d9534f" }}>Invalid Date Range</h2>
              <p>Start date cannot be after end date.</p>
              <button
                onClick={() => setShowDateError(false)}
                style={{
                  marginTop: "12px",
                  padding: "8px 16px",
                  backgroundColor: "#0d6efd",
                  border: "none",
                  borderRadius: "6px",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                OK
              </button>
            </div>
          </div>
        )}
      </div>
    </DndProvider>
  );
};

export default DatePicker;
