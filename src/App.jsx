import React from "react";
import DatePicker from "./components/DatePicker";
import ColumnSelector from "./components/ColumnSelector";
import AnalyticsTable from "./components/AnalyticsTable";

function App() {
  return (
    <div className="p-4">
      <h1>Analytics</h1>
      <DatePicker />
      <ColumnSelector />
      <AnalyticsTable />
    </div>
  );
}

export default App;
