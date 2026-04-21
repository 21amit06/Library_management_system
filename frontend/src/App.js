import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import SearchBooks from "./pages/SearchBooks";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Sidebar from "./components/Sidebar";
import MyBooks from "./pages/MyBooks";

function App() {
  return (
    <BrowserRouter>

      <div className="flex">

        {/* 🔥 Sidebar */}
        <Sidebar />

        {/* 🔥 Main Content */}
        <div className="ml-60 w-full p-4">

          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/search" element={<SearchBooks />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/mybooks" element={<MyBooks />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>

        </div>

      </div>

    </BrowserRouter>
  );
}

export default App;