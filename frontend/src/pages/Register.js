import { useState } from "react";
import API from "../services/api";

function Register() {

  const [role, setRole] = useState("student");

  const [form, setForm] = useState({
    name: "",
    rollNumber: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async () => {
    try {

      // ✅ VALIDATION
      if (!form.name || !form.email || !form.password) {
        alert("Fill all required fields");
        return;
      }

      if (role === "student" && !form.rollNumber) {
        alert("Roll number required for student");
        return;
      }

      // ✅ SEND DATA
      await API.post("/auth/register", {
        ...form,
        role
      });

      alert("Registered Successfully");

      // RESET
      setForm({
        name: "",
        rollNumber: "",
        email: "",
        password: ""
      });

    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-yellow-500 to-indigo-600">

      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">

        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          📚 Register
        </h2>

        {/* ROLE SELECT */}
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full border p-3 rounded-lg mb-3"
        >
          <option value="student">Student</option>
          <option value="librarian">Librarian</option>
        </select>

        {/* NAME */}
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg mb-3 focus:ring-2 focus:ring-blue-400"
        />

        {/* ROLL NUMBER (ONLY FOR STUDENT) */}
        {role === "student" && (
          <input
            type="text"
            name="rollNumber"
            placeholder="Roll Number"
            value={form.rollNumber}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg mb-3 focus:ring-2 focus:ring-blue-400"
          />
        )}

        {/* EMAIL */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg mb-3 focus:ring-2 focus:ring-blue-400"
        />

        {/* PASSWORD */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg mb-5 focus:ring-2 focus:ring-blue-400"
        />

        {/* BUTTON */}
        <button
          onClick={handleRegister}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
        >
          Register
        </button>

      </div>
    </div>
  );
}

export default Register;