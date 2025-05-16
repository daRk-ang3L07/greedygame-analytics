# 📊 GreedyGame Analytics Table Assignment

This project is a frontend analytics dashboard built using **React** and **Redux** that allows users to view and interact with ad performance data through a customizable table interface.

---

## 🚀 Features

### 🔢 Analytics Page (`/analytics`)
- Date Range Picker to query reports for selected dates *(Supported range: June 1–30, 2021)*.
- Fetches report and app data from GreedyGame's REST API.
- Displays analytics data in a feature-rich, customizable table.

### 📋 Table Functionalities
- ✅ **Always Visible Columns**: `Date`, `App Name`.
- ✅ **Selectable Columns**: User can enable/hide the following columns:
  - AD Request
  - AD Response
  - Impression
  - Clicks
  - Revenue
  - Fill Rate *(= Ad Request / Ad Response \* 100%)*
  - CTR *(= Clicks / Impression \* 100%)*
- ✅ **Drag & Drop Column Reordering**
- ✅ **Sorting and Filtering** per column
- ✅ **Responsive Design**: Works across all screen sizes
- ✅ **Data Formatting**: Number formatting, precision adjustments, percentage calculations, and more.



---

## 📦 Tech Stack

| Tech       | Description                            |
|------------|----------------------------------------|
| React      | Frontend Framework                     |
| Redux      | State Management                       |
| Redux Toolkit | Redux simplification & best practices |
| React Router | Routing for `/analytics`             |
| Vite       | Fast dev server and bundler            |
| No Table Library | Fully custom table implementation |

---


## 🔧 How to Run the Project

Follow the steps below to set up and run the project locally:

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/greedygame-analytics-table.git
cd greedygame-analytics-table
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Development Server

```bash
npm run dev
```

### 4. Navigate to the Analytic Page

```bash
http://localhost:5173/
```


