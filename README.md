# 📊 VC Analytics Dashboard

A modern, high-performance sales analytics dashboard built with **React 19**, **Vite**, and **Tailwind CSS v4.0**. This dashboard provides real-time insights from CSV-based sales data, featuring a premium SaaS-inspired user interface.

## ✨ Features

- **📈 Performance KPIs**: Instantly track Total Revenue, Orders, Profit, and Average Order Value (AOV).
- **📉 Trend Visualization**: Clean trend indicators to monitor performance changes over time.
- **📄 Interactive Data Table**: A scrollable, well-formatted table for exploring granular sales data records.
- **⚡ Fast Data Parsing**: Powered by `PapaParse` for rapid client-side CSV processing.
- **🎨 Premium UI/UX**: Designed with a clean, modern aesthetic using **Lucide React** icons and a customized Tailwind design system.

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/)

### Installation

1. **Clone the repository** (if applicable):
   ```bash
   git clone <repository-url>
   cd vc-dashboard
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Visit the dashboard**:
   Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📁 Project Structure

```text
├── public/
│   └── data/               # Sales CSV data source
├── src/
│   ├── assets/             # Images and static assets
│   ├── App.jsx             # Main dashboard logic and UI components
│   ├── index.css           # Tailwind configuration and global styles
│   └── main.jsx            # React entry point
├── tailwind.config.js      # Tailwind CSS customization
├── postcss.config.js       # PostCSS configuration for Tailwind 4.0
└── package.json            # Dependencies and scripts
```

## 🗄️ Database Architecture

The application has a dynamic Data Layer that allows it to run entirely locally using a sample CSV, or scale into a full production PostgreSQL database powered by [Supabase](https://supabase.com/).

The backend API is configured to read data from a local CSV by default, but is fully ready to connect to Supabase.

1. Go to Supabase and create a new project.
2. In the SQL Editor, create the sales_data table by running this SQL snippet:
```sql
CREATE TABLE sales_data (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  product TEXT NOT NULL,
  channel TEXT NOT NULL,
  orders INTEGER NOT NULL,
  revenue NUMERIC NOT NULL,
  cost NUMERIC NOT NULL,
  visitors INTEGER NOT NULL,
  customers INTEGER NOT NULL
);
```

3. Import your CSV data into this table via the Supabase Table Editor:
   - Click the **"Table Editor"** icon (it looks like a grid) on the left sidebar of your Supabase dashboard.
   - Click on your newly created **`sales_data`** table under the schemas list.
   - Click the green **"Insert"** button at the top right, then select **"Import data from CSV"**.
   - Upload the `sales_data.csv` file from your project's `public/data/` folder.
   - Ensure the columns match, and click **Import Data**.
4. Get your exact API credentials from Supabase (Two easy ways!):
   **Method A (Easiest - From the Home Page):**
   - Click the **"Home" house icon** at the top left of your sidebar.
   - Scroll down the middle of the page until you see a section labeled **"Project API keys"** or **"Connecting to your project"**.
   - Your **Project URL** and **anon / public** key will be displayed right there with 'Copy' buttons!
   
   **Method B (If Method A doesn't show it):**
   - Click the **"Project Settings"** gear ⚙️ icon at the bottom left of the screen.
   - Look at the menu panel that just opened to the right of the dark sidebar. Look for the **"Configuration"** section and click **"API"**.
   - You will see the **Project URL** at the top, and the **anon / public** key just below it. Click the 'Copy' buttons.
5. In your local `.env` file, add your credentials and set the `DATA_SOURCE`:
```env
DATA_SOURCE=supabase
SUPABASE_URL=your_project_url
SUPABASE_ANON_KEY=your_anon_key
```
6. Restart your development server. The API will now serve data directly from Supabase!

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4.0](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Data Parsing**: [PapaParse](https://www.papaparse.com/)

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.
