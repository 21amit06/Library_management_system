import { useEffect, useState } from "react";
import API from "../services/api";

function SearchBooks(){

  const [books,setBooks] = useState([]);
  const [search,setSearch] = useState("");        // 🔍 search text
  const [filtered,setFiltered] = useState([]);    // 🔍 filtered books

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const fetchBooks = async () => {
    try {
      const res = await API.get("/books");
      setBooks(res.data);
      setFiltered(res.data); // initially all books
    } catch (err) {
      alert("Error loading books");
    }
  };

  useEffect(()=>{
    fetchBooks();
  },[]);

  // 🔍 HANDLE SEARCH
  const handleSearch = (value) => {
    setSearch(value);

    const filteredBooks = books.filter(b =>
      b.title.toLowerCase().includes(value.toLowerCase()) ||
      b.author.toLowerCase().includes(value.toLowerCase())
    );

    setFiltered(filteredBooks);
  };

  // 📚 BORROW (only student)
  const borrowBook = async (bookId) => {
    try {
      await API.post(`/borrow/borrow/${bookId}`,{},{
        headers:{ Authorization:`Bearer ${token}` }
      });

      alert("Book Borrowed");
      fetchBooks();

    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return(
    <div className="min-h-screen bg-gray-100 p-8">

      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        📚 Library Collection
      </h2>

      {/* 🔍 SEARCH BAR */}
      <input
        type="text"
        placeholder="Search by title or author..."
        value={search}
        onChange={(e)=>handleSearch(e.target.value)}
        className="w-full p-3 mb-6 border rounded-lg shadow-sm"
      />

      {/* 📚 BOOK LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

        {filtered.length === 0 && (
          <p>No books found</p>
        )}

        {filtered.map(book=>(

          <div key={book._id}
            className="bg-white rounded-2xl shadow-md p-5 hover:shadow-xl transition">

            <h3 className="text-lg font-semibold mb-1">
              {book.title}
            </h3>

            <p className="text-sm text-gray-500 mb-2">
              by {book.author}
            </p>

            <p className={
              book.availableCopies > 0
                ? "text-green-600"
                : "text-red-500"
            }>
              {book.availableCopies > 0 ? "Available" : "Out of Stock"}
            </p>

            <p className="text-sm text-gray-600 mb-3">
              Available: {book.availableCopies}
            </p>

            {/* 👨‍🎓 ONLY STUDENT CAN BORROW */}
            {role === "student" && (
              <button
                disabled={book.availableCopies === 0}
                onClick={()=>borrowBook(book._id)}
                className={`w-full py-2 rounded text-white ${
                  book.availableCopies > 0
                    ? "bg-blue-500 hover:bg-blue-600"
                    : "bg-gray-400"
                }`}
              >
                Borrow
              </button>
            )}

          </div>

        ))}

      </div>

    </div>
  );
}

export default SearchBooks;