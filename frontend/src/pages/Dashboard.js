import { useEffect, useState } from "react";
import API from "../services/api";

function Dashboard(){

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const [data,setData] = useState(null);

  const fetchData = async () => {
    try {
      const url =
        role === "librarian"
          ? "/admin/dashboard"
          : "/student/dashboard";

      const res = await API.get(url, {
        headers:{ Authorization:`Bearer ${token}` }
      });

      setData(res.data);

    } catch (err) {
      console.log(err);
      alert("Error loading dashboard");
    }
  };

  useEffect(()=>{
    fetchData();
  },[]);

  if(!data) return <p className="p-6">Loading...</p>;

  // ✅ SAFE DATA (NO CRASH)
  const safeData = {
    totalBorrowed: data.totalBorrowed || 0,
    totalFine: data.totalFine || 0,
    dueSoon: data.dueSoon || [],
    overdue: data.overdue || [],
    lastBorrowed: data.lastBorrowed || null
  };

  // ================= STUDENT DASHBOARD =================
  if(role === "student"){
    return(
      <div className="min-h-screen bg-gray-100 p-8">

        <h2 className="text-3xl font-bold mb-6">📊 Student Dashboard</h2>

        {/* 👤 STUDENT INFO */}
        <div className="bg-white p-4 rounded shadow mb-6">
         <p><b>Name:</b> {data.user?.name}</p>
<p><b>Roll Number:</b> {data.user?.rollNumber}</p>
        </div>

        {/* 📊 CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

          <div className="bg-white p-6 rounded shadow">
            <p>Total Borrowed</p>
            <h3 className="text-2xl font-bold">
              {safeData.totalBorrowed}
            </h3>
          </div>

          <div className="bg-white p-6 rounded shadow">
            <p>Due Soon</p>
            <h3 className="text-2xl text-yellow-500">
              {safeData.dueSoon.length}
            </h3>
          </div>

          <div className="bg-white p-6 rounded shadow">
            <p>Overdue</p>
            <h3 className="text-2xl text-red-500">
              {safeData.overdue.length}
            </h3>
          </div>

          <div className="bg-white p-6 rounded shadow">
            <p>Total Fine</p>
            <h3 className="text-2xl text-green-600">
              ₹{safeData.totalFine}
            </h3>
          </div>

        </div>

        {/* 📖 LAST BORROWED */}
        <div className="bg-white p-6 rounded shadow mb-6">

          <h3 className="font-semibold mb-3">📖 Last Borrowed Book</h3>

          {safeData.lastBorrowed ? (
            <div>
              <p className="font-bold">
                {safeData.lastBorrowed.bookId?.title}
              </p>
              <p>
                Due: {new Date(safeData.lastBorrowed.dueDate).toDateString()}
              </p>
            </div>
          ) : (
            <p>No books borrowed</p>
          )}

        </div>

        {/* ⏳ DUE SOON */}
        <div className="bg-white p-6 rounded shadow mb-6">

          <h3 className="font-semibold mb-3">⏳ Due Soon</h3>

          {safeData.dueSoon.length === 0 && <p>No books</p>}

          {safeData.dueSoon.map(b=>(
            <p key={b._id}>
              {b.bookId?.title} - {new Date(b.dueDate).toDateString()}
            </p>
          ))}

        </div>

        {/* ⚠️ OVERDUE */}
        <div className="bg-white p-6 rounded shadow">

          <h3 className="font-semibold mb-3 text-red-500">⚠️ Overdue</h3>

          {safeData.overdue.length === 0 && <p>No overdue books</p>}

          {safeData.overdue.map(b=>(
            <p key={b._id} className="text-red-500">
              {b.bookId?.title} - {new Date(b.dueDate).toDateString()}
            </p>
          ))}

        </div>

      </div>
    );
  }

  // ================= LIBRARIAN DASHBOARD =================
  return(
    <div className="min-h-screen bg-gray-100 p-8">

      <h2 className="text-3xl font-bold mb-6">
        📊 Librarian Dashboard
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">

        <div className="bg-white p-6 rounded shadow">
          <p>Total Books</p>
          <h3 className="text-2xl">
            {data.totalBooks || 0}
          </h3>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <p>Borrowed Books</p>
          <h3 className="text-2xl">
            {data.borrowedCount || 0}
          </h3>
        </div>

      </div>

      <h3 className="text-xl mb-4">⏳ Due Soon</h3>

      {(data.dueSoon || []).map(b=>(
        <div key={b._id}
          className="bg-white p-4 mb-3 rounded">

          <p><b>{b.bookId?.title}</b></p>
          <p>{b.studentId?.name}</p>
          <p>{b.studentId?.rollNumber}</p>
          <p>Due: {new Date(b.dueDate).toDateString()}</p>

        </div>
      ))}

    </div>
  );
}

export default Dashboard;