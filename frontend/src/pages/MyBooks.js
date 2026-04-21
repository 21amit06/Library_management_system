import { useEffect, useState } from "react";
import API from "../services/api";

function MyBooks(){

  const [data, setData] = useState(null);
  const token = localStorage.getItem("token");

  const fetchData = async () => {
    try {

      const res = await API.get("/student/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setData(res.data);

    } catch (err) {
      console.log(err);
      alert("Error loading books");
    }
  };

  useEffect(()=>{
    fetchData();
  },[]);

  if (!data) return <p className="p-6">Loading...</p>;

  const borrowedBooks = data.borrowedBooks || [];

  return(
    <div className="p-6">

      <h2 className="text-2xl font-bold mb-4">📚 My Books</h2>

      {borrowedBooks.length === 0 && (
        <p>No books borrowed</p>
      )}

      {borrowedBooks.map(b => (

        <div key={b._id}
          className="bg-white shadow-md rounded-lg p-4 mb-4">

          <h3 className="text-lg font-semibold">
            {b.bookId ? b.bookId.title : "Book Removed"}
          </h3>

          <p className="text-gray-600">
            Due: {new Date(b.dueDate).toDateString()}
          </p>

          <p className="text-red-500">
            Fine: ₹{b.fine}
          </p>

        </div>

      ))}

      <h3 className="mt-4 font-bold">
        Total Fine: ₹{data.totalFine || 0}
      </h3>

    </div>
  );
}

export default MyBooks;