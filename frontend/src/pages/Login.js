import { useState } from "react";
import API from "../services/api";

function Login(){

  const [rollNumber,setRoll] = useState("");
  const [password,setPassword] = useState("");
  const [role,setRole] = useState("student");
  const [code,setCode] = useState("");

  const login = async ()=>{
    try{

      const payload =
        role === "librarian"
          ? { password, code }
          : { rollNumber, password };

      const res = await API.post("/auth/login", payload);

      localStorage.setItem("token",res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("rollNumber", res.data.rollNumber);
localStorage.setItem("name", res.data.name);

      if(res.data.role==="librarian"){
        window.location.href="/admin";
      }else{
        window.location.href="/dashboard";
      }

    }catch(err){
      alert(err.response?.data?.message);
    }
  };

 return(
  <div className="flex justify-center items-center h-screen bg-gray-100">

    <div className="bg-white p-6 rounded shadow w-80">

      <h2 className="text-xl mb-4">Login</h2>

      <select
        className="border p-2 w-full mb-2"
        onChange={e=>setRole(e.target.value)}
      >
        <option value="student">Student</option>
        <option value="librarian">Librarian</option>
      </select>

      {role==="student" && (
        <input
          className="border p-2 w-full mb-2"
          placeholder="Roll Number"
          onChange={e=>setRoll(e.target.value)}
        />
      )}

      {role==="librarian" && (
        <input
          className="border p-2 w-full mb-2"
          placeholder="Librarian Code"
          onChange={e=>setCode(e.target.value)}
        />
      )}

      <input
        type="password"
        className="border p-2 w-full mb-2"
        placeholder="Password"
        onChange={e=>setPassword(e.target.value)}
      />

      <button
        onClick={login}
        className="bg-blue-500 text-white w-full p-2 rounded"
      >
        Login
      </button>

      {/* ✅ REGISTER BACK */}
      <p className="mt-3 text-center">
        Don't have account?{" "}
        <a href="/register" className="text-blue-500">
          Register
        </a>
      </p>

    </div>

  </div>
);
}

export default Login;