import React, { useState, useMemo, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAnalytics, fetchApps } from "../redux/analyticsSlice";
import { formatCurrency, formatNumber } from "../utils/formatter";
import sharechatIcon from "../asset/funnel.svg";
import sharechat from "../asset/sharechat.svg";

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

const getAppName = (id, apps) => {
  const app = apps.find((a) => a.app_id === id);
  return app ? app.app_name : "N/A";
};

const FilterPopup = ({
  columnKey,
  onClose,
  onApply,
  currentSort,
  isApp,
  appSearch,
}) => {
  const [sortDirection, setSortDirection] = useState(currentSort?.direction || "none");
  const [localAppSearch, setLocalAppSearch] = useState(appSearch || "");

  useEffect(() => {
    setLocalAppSearch(appSearch || "");
  }, [appSearch]);

  const radioNoneRef = useRef(null);
  useEffect(() => {
    if (radioNoneRef.current) radioNoneRef.current.focus();
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        top: 38,
        left: "50%",
        transform: "translateX(-50%)",
        background: "#fff",
        border: "1px solid #e0e0e0",
        borderRadius: 10,
        boxShadow: "0 4px 24px rgba(60,64,67,0.14)",
        zIndex: 100,
        minWidth: 220,
        padding: 18,
        display: "flex",
        flexDirection: "column",
        gap: 16,
        alignItems: "flex-start",
      }}
      onClick={e => e.stopPropagation()}
    >
      <div style={{ fontWeight: 500, fontSize: 15, marginBottom: 2 }}>Sort/Filter</div>
      <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <input
          type="radio"
          name="sort"
          ref={radioNoneRef}
          checked={sortDirection === "none"}
          onChange={() => setSortDirection("none")}
        />
        None
      </label>
      <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <input
          type="radio"
          name="sort"
          checked={sortDirection === "asc"}
          onChange={() => setSortDirection("asc")}
        />
        Ascending
      </label>
      <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <input
          type="radio"
          name="sort"
          checked={sortDirection === "desc"}
          onChange={() => setSortDirection("desc")}
        />
        Descending
      </label>
      {isApp && (
        <div style={{ width: "100%" }}>
          <div style={{ fontWeight: 500, fontSize: 15, margin: "8px 0 4px" }}>App Search</div>
          <input
            type="text"
            placeholder="Type to search apps"
            value={localAppSearch}
            onChange={e => setLocalAppSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "7px 11px",
              borderRadius: 5,
              border: "1px solid #ccc",
              fontSize: 14,
              background: "#f7f9fa",
              outline: "none",
              boxSizing: "border-box"
            }}
            autoFocus
          />
        </div>
      )}
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", width: "100%", marginTop: 8 }}>
        <button
          onClick={onClose}
          style={{
            padding: "6px 16px",
            border: "none",
            background: "#e0e0e0",
            borderRadius: 5,
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          Cancel
        </button>
        <button
          onClick={() => onApply(sortDirection, isApp ? localAppSearch : undefined)}
          style={{
            padding: "6px 16px",
            border: "none",
            background: "#1a73e8",
            color: "#fff",
            borderRadius: 5,
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          Apply
        </button>
      </div>
    </div>
  );
};

const AnalyticsTable = () => {
  const dispatch = useDispatch();
  const { data, apps } = useSelector((state) => state.analytics);
  const selectedColumns = useSelector((state) => state.ui.selectedColumns);
  const columnOrder = useSelector((state) => state.ui.columnOrder);

  const [sortConfig, setSortConfig] = useState({ key: null, direction: "none" });
  const [appFilter, setAppFilter] = useState("");
  const [openFilter, setOpenFilter] = useState(null);
  const [popupAppSearch, setPopupAppSearch] = useState("");

  useEffect(() => {
    const defaultStartDate = "2023-01-01";
    const defaultEndDate = "2023-12-31";
    dispatch(fetchAnalytics({ startDate: defaultStartDate, endDate: defaultEndDate }));
    dispatch(fetchApps());
  }, [dispatch]);

  useEffect(() => {
    if (openFilter !== null) {
      const close = () => setOpenFilter(null);
      window.addEventListener("click", close);
      return () => window.removeEventListener("click", close);
    }
  }, [openFilter]);

  const calculateDerived = (row) => ({
    ...row,
    fillRate:
      row.requests && row.requests !== 0
        ? ((row.responses / row.requests) * 100).toFixed(2) + "%"
        : "0.00%",
    ctr:
      row.impression && row.impression !== 0 && row.clicks
        ? ((row.clicks / row.impression) * 100).toFixed(2) + "%"
        : "0.00%",
  });

  const handleApplyFilter = (key, direction, appSearch) => {
    if (key === "app") setAppFilter(appSearch ?? "");
    if (direction === "none") {
      setSortConfig({ key: null, direction: "none" });
    } else {
      setSortConfig({ key, direction });
    }
    setOpenFilter(null);
  };

  const filteredSortedData = useMemo(() => {
    let processed = data.map((row) => calculateDerived(row));
    if (appFilter) {
      processed = processed.filter((row) =>
        getAppName(row.app_id, apps).toLowerCase().includes(appFilter.toLowerCase())
      );
    }
    if (sortConfig.key && sortConfig.direction !== "none") {
      processed.sort((a, b) => {
        if (sortConfig.key === "date") {
          const timeA = new Date(a.date).getTime();
          const timeB = new Date(b.date).getTime();
          return sortConfig.direction === "asc" ? timeA - timeB : timeB - timeA;
        }
        if (sortConfig.key === "impression") {
          const valA = a.impression || 0;
          const valB = b.impression || 0;
          return sortConfig.direction === "asc" ? valA - valB : valB - valA;
        }
        if (sortConfig.key === "response") {
          const valA = a.responses || 0;
          const valB = b.responses || 0;
          return sortConfig.direction === "asc" ? valA - valB : valB - valA;
        }
        if (sortConfig.key === "app") {
          const appA = getAppName(a.app_id, apps);
          const appB = getAppName(b.app_id, apps);
          return sortConfig.direction === "asc"
            ? appA.localeCompare(appB)
            : appB.localeCompare(appA);
        }
        const valA = a[sortConfig.key] || 0;
        const valB = b[sortConfig.key] || 0;
        const isNumeric = !isNaN(parseFloat(valA)) && !isNaN(parseFloat(valB));
        if (isNumeric) {
          return sortConfig.direction === "asc"
            ? parseFloat(valA) - parseFloat(valB)
            : parseFloat(valB) - parseFloat(valA);
        } else {
          if (!valA && valA !== 0) return sortConfig.direction === "asc" ? -1 : 1;
          if (!valB && valB !== 0) return sortConfig.direction === "asc" ? 1 : -1;
          return sortConfig.direction === "asc"
            ? String(valA).localeCompare(String(valB))
            : String(valB).localeCompare(String(valA));
        }
      });
    }
    return processed;
  }, [data, apps, appFilter, sortConfig]);

  const renderCellContent = (key, row) => {
    switch (key) {
      case "date":
        return new Date(row.date).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
      case "app": {
        const appName = getAppName(row.app_id, apps);
        return (
          <span style={{ display: "flex", alignItems: "center" }}>
            <img
              src={sharechat}
              alt="App"
              style={{ width: 20, height: 20, marginRight: 8, borderRadius: 4 }}
            />
            {appName}
          </span>
        );
      }
      case "clicks":
        return formatNumber(row.clicks);
      case "requests":
        return formatNumber(row.requests);
      case "response":
        return formatNumber(row.responses);
      case "impression":
        return formatNumber(row.impression);
      case "revenue": {
        const revenue = Number(row.revenue);
        return formatCurrency(isNaN(revenue) ? 0 : revenue);
      }
      case "fillRate":
        return row.fillRate;
      case "ctr":
        return row.ctr;
      default:
        return row[key];
    }
  };

  return (
    <div
      style={{
        width: "100%",
        marginTop: "1rem",
        fontFamily: "'Google Sans', Arial, sans-serif",
        overflowX: "auto",
        WebkitOverflowScrolling: "touch"
      }}
    >
      <table style={{ minWidth: 700, width: "100%", borderCollapse: "collapse" }}>
        <thead>
          {/* FILTER ICON ROW */}
          <tr>
            {columnOrder.map(
              (key) =>
                selectedColumns.includes(key) && (
                  <th
                    key={key}
                    style={{
                      position: "relative",
                      height: 48,
                      background: "#f7f9fa",
                      border: "none",
                      padding: 0,
                      textAlign: "center",
                      verticalAlign: "middle"
                    }}
                  >
                    <div style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "48px"
                    }}>
                      <img
                        src={sharechatIcon}
                        alt="Filter"
                        style={{
                          width: 28,
                          height: 28,
                          cursor: "pointer",
                          borderRadius: 8,
                          border: openFilter === key ? "2px solid #1976d2" : "2px solid transparent",
                          boxShadow: openFilter === key ? "0 2px 8px #b8b8b8" : "none",
                          background: "#fff",
                          padding: 2,
                          transition: "box-shadow 0.2s, border 0.2s"
                        }}
                        onClick={e => {
                          e.stopPropagation();
                          setOpenFilter(openFilter === key ? null : key);
                          if (key === "app") setPopupAppSearch(appFilter);
                        }}
                        tabIndex={0}
                      />
                      {openFilter === key && (
                        <FilterPopup
                          columnKey={key}
                          onClose={() => setOpenFilter(null)}
                          onApply={(direction, appSearch) =>
                            handleApplyFilter(key, direction, appSearch)
                          }
                          currentSort={sortConfig.key === key ? sortConfig : { direction: "none" }}
                          isApp={key === "app"}
                          appSearch={popupAppSearch}
                        />
                      )}
                    </div>
                  </th>
                )
            )}
          </tr>
          {/* COLUMN HEADER ROW */}
          <tr>
            {columnOrder.map(
              (key) =>
                selectedColumns.includes(key) && (
                  <th
                    key={key}
                    style={{
                      textAlign: "center",
                      padding: "12px 16px",
                      fontWeight: "500",
                      fontSize: "13px",
                      color: "#5f6368",
                      userSelect: "none",
                      borderBottom: "1px solid #e8eaed",
                      whiteSpace: "nowrap",
                      background: "#fff",
                    }}
                  >
                    {allColumns[key]}
                  </th>
                )
            )}
          </tr>
        </thead>
        <tbody>
          {filteredSortedData.length === 0 ? (
            <tr>
              <td
                colSpan={selectedColumns.length}
                style={{
                  padding: "16px",
                  textAlign: "center",
                  color: "#80868b",
                }}
              >
                No data found
              </td>
            </tr>
          ) : (
            filteredSortedData.map((row, idx) => (
              <tr
                key={idx}
                style={{
                  borderBottom: "1px solid #e8eaed",
                  backgroundColor: idx % 2 === 0 ? "#fff" : "#f9fafb",
                  cursor: "default",
                  transition: "background-color 0.15s ease",
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#f1f3f4")}
                onMouseLeave={e =>
                  (e.currentTarget.style.backgroundColor = idx % 2 === 0 ? "#fff" : "#f9fafb")
                }
              >
                {columnOrder.map(
                  (key) =>
                    selectedColumns.includes(key) && (
                      <td
                        key={key}
                        style={{
                          padding: "12px 16px",
                          textAlign: "center",
                          display: key === "app" ? "flex" : undefined,
                          alignItems: key === "app" ? "center" : undefined,
                          whiteSpace: "nowrap",
                          fontWeight: key === "app" ? 500 : 400,
                          color: "#3c4043",
                        }}
                      >
                        {renderCellContent(key, row)}
                      </td>
                    )
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AnalyticsTable;
