import { Link } from "react-router-dom";

function Sidebar() {

  const role = localStorage.getItem("role");

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="h-screen w-60 bg-gray-800 text-white p-4 fixed">

      <h2 className="text-xl mb-6">📚 Library</h2>

      <ul className="space-y-4">

        {/* Dashboard */}
        <li><Link to="/dashboard">Dashboard</Link></li>

        {/* Books */}
        <li><Link to="/search">Books</Link></li>

        {/* ONLY STUDENT */}
        {role === "student" && (
          <li><Link to="/mybooks">My Books</Link></li>
        )}

        {/* ONLY LIBRARIAN */}
        {role === "librarian" && (
          <li><Link to="/admin">Admin</Link></li>
        )}

        {/* Logout */}
        <li>
          <button onClick={logout} className="text-red-400">
            Logout
          </button>
        </li>

      </ul>

    </div>
  );
}

export default Sidebar;