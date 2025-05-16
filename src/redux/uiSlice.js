import { createSlice } from '@reduxjs/toolkit';

const allColumns = [
  'date', 'app', 'clicks', 'requests',
  'response', 'impression', 'revenue',
  'fillRate', 'ctr'
];

const initialState = {
  selectedColumns: [...allColumns],
  columnOrder: [...allColumns]
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // This is the only action you need for settings panel "Apply Changes"
    applyColumnChanges: (state, action) => {
      if (action.payload) {
        state.selectedColumns = action.payload.selectedColumns;
        state.columnOrder = action.payload.columnOrder;
      }
    },
    resetColumnSelection: (state) => {
      state.selectedColumns = [...allColumns];
      state.columnOrder = [...allColumns];
    }
  }
});

export const {
  applyColumnChanges,
  resetColumnSelection
} = uiSlice.actions;

export default uiSlice.reducer;
