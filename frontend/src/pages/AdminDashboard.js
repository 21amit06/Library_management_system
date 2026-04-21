import { useEffect, useState } from "react";
import API from "../services/api";

function AdminDashboard(){

  const token = localStorage.getItem("token");

  const [title,setTitle]=useState("");
  const [author,setAuthor]=useState("");
  const [copies,setCopies]=useState("");

  const [books,setBooks] = useState([]);

  // 🔥 RETURN BOOK STATES
  const [returnRoll, setReturnRoll] = useState("");
  const [borrowedBooks, setBorrowedBooks] = useState([]);

  // ✅ SELECTED BOOK FOR RETURN
const [selectedReturnId, setSelectedReturnId] = useState("");

  const [returnSearch, setReturnSearch] = useState("");
  const [filteredReturnBooks, setFilteredReturnBooks] = useState([]);

  // 🔍 DELETE SEARCH STATES
  const [searchDelete,setSearchDelete] = useState("");
  const [filteredDelete,setFilteredDelete] = useState([]);
  const [selectedDelete,setSelectedDelete] = useState("");

  // 📚 ASSIGN STATES
  const [assignRoll, setAssignRoll] = useState("");
  const [searchBook, setSearchBook] = useState("");
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState("");

  // ================= FETCH BOOKS =================
  const fetchBooks = async () => {
    try {
      const res = await API.get("/books");
      setBooks(res.data || []);
    } catch {
      alert("Error loading books");
    }
  };

  useEffect(()=>{
    fetchBooks();
  },[]);

  // ================= FETCH BORROWED BOOKS =================
  const fetchBorrowedBooks = async () => {
    if(!returnRoll){
      alert("Enter roll number");
      return;
    }

    try {
      const res = await API.get(`/student/by-roll/${returnRoll}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setBorrowedBooks(res.data || []);
      setFilteredReturnBooks(res.data || []);

    } catch {
      alert("Student not found");
      setBorrowedBooks([]);
      setFilteredReturnBooks([]);
    }
  };

  // ================= RETURN SEARCH =================
  const handleReturnSearch = (value) => {
    setReturnSearch(value);

    const filtered = borrowedBooks.filter(b =>
      b.bookId?.title?.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredReturnBooks(filtered);
  };

  // ================= RETURN BOOK =================
  const handleReturnBook = async () => {

  if(!selectedReturnId){
    alert("Select a book to return");
    return;
  }

  try {

    await API.post(`/admin/return-book/${selectedReturnId}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });

    alert("Book Returned");

    // RESET
    setSelectedReturnId("");
    setReturnSearch("");

    fetchBorrowedBooks();

  } catch (err) {
    alert(err.response?.data?.message || "Error returning book");
  }
};

  // ================= ADD BOOK =================
  const addBook = async ()=>{
    if(!title || !author || !copies){
      alert("Fill all fields");
      return;
    }

    await API.post("/admin/add-book",
      { title, author, totalCopies: copies },
      { headers:{ Authorization:`Bearer ${token}` }
    });

    alert("Book Added");

    setTitle("");
    setAuthor("");
    setCopies("");

    fetchBooks();
  };

  // ================= ASSIGN SEARCH =================
  const handleBookSearch = (value) => {
    setSearchBook(value);

    const filtered = books.filter(b =>
      b.title?.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredBooks(filtered);
  };

  // ================= ASSIGN BOOK =================
  const assignBook = async () => {
    if (!assignRoll || !selectedBook) {
      alert("Enter roll number and select book");
      return;
    }

    try {

      await API.post("/admin/assign-book",
        { rollNumber: assignRoll, bookId: selectedBook },
        { headers:{ Authorization:`Bearer ${token}` } }
      );

      alert("Book Assigned");

      setAssignRoll("");
      setSearchBook("");
      setSelectedBook("");
      setFilteredBooks([]);

    } catch (err) {
      alert(err.response?.data?.message || "Error assigning book");
    }
  };

  // ================= DELETE SEARCH =================
  const handleDeleteSearch = (value) => {
    setSearchDelete(value);

    const filtered = books.filter(b =>
      b.title?.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredDelete(filtered);
  };

  // ================= DELETE BOOK =================
  const deleteBook = async ()=>{
    if(!selectedDelete){
      alert("Select a book");
      return;
    }

    if(!window.confirm("Delete this book?")) return;

    await API.delete(`/admin/delete-book/${selectedDelete}`,{
      headers:{ Authorization:`Bearer ${token}` }
    });

    alert("Book Deleted");

    setSearchDelete("");
    setSelectedDelete("");
    setFilteredDelete([]);

    fetchBooks();
  };

  return(
    <div className="min-h-screen bg-gray-100 p-8">

      <h2 className="text-3xl font-bold mb-6">⚙️ Admin Panel</h2>

      {/* 📚 ASSIGN BOOK */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">

        <h3 className="font-semibold mb-3">📚 Assign Book</h3>

        <input
          placeholder="Enter Student Roll Number"
          value={assignRoll}
          onChange={e=>setAssignRoll(e.target.value)}
          className="border p-2 w-full mb-2"
        />

        <input
          placeholder="Search Book..."
          value={searchBook}
          onChange={e=>handleBookSearch(e.target.value)}
          className="border p-2 w-full mb-2"
        />

        {searchBook && (
          <div className="border max-h-40 overflow-y-auto mb-2">

            {filteredBooks.length === 0 && (
              <p className="p-2 text-gray-500">No books found</p>
            )}

            {filteredBooks.map(b=>(
              <div
                key={b._id}
                onClick={()=>{
                  setSelectedBook(b._id);
                  setSearchBook(b.title);
                  setFilteredBooks([]);
                }}
                className="p-2 hover:bg-gray-200 cursor-pointer"
              >
                {b.title} ({b.availableCopies})
              </div>
            ))}

          </div>
        )}

        <button
          onClick={assignBook}
          className="bg-purple-500 text-white px-4 py-2"
        >
          Assign Book
        </button>

      </div>

      {/* 🔄 RETURN BOOK */}
      {/* 🔄 RETURN BOOK */}
<div className="bg-white p-6 rounded-xl shadow mb-6">

  <h3 className="font-semibold mb-3">🔄 Return Book</h3>

  {/* STEP 1: ENTER ROLL */}
  <input
    placeholder="Enter Student Roll Number"
    value={returnRoll}
    onChange={e => setReturnRoll(e.target.value)}
    className="border p-2 mr-2"
  />

  <button
    onClick={fetchBorrowedBooks}
    className="bg-blue-500 text-white px-4 py-2"
  >
    Load Books
  </button>

  {/* STEP 2: SHOW BOOKS */}
  {borrowedBooks.length > 0 && (
    <>
      {/* SEARCH */}
      <input
        placeholder="Search Book..."
        value={returnSearch}
        onChange={e => handleReturnSearch(e.target.value)}
        className="border p-2 w-full mt-4 mb-2"
      />

      <div className="max-h-60 overflow-y-auto border rounded">

        {filteredReturnBooks.length === 0 && (
          <p className="p-2 text-gray-500">No matching books</p>
        )}

        {filteredReturnBooks.map(b => (
          <div
            key={b._id}
            className="flex items-center gap-3 p-3 border-b"
          >

            {/* ✅ RADIO SELECT */}
            <input
              type="radio"
              name="returnBook"
              checked={selectedReturnId === b._id}
              onChange={() => setSelectedReturnId(b._id)}
            />

            <div>
              <p className="font-medium">
                {b.bookId?.title || "Book Removed"}
              </p>

              <p className="text-sm text-gray-500">
                Due: {new Date(b.dueDate).toDateString()}
              </p>
            </div>

          </div>
        ))}

      </div>

      {/* STEP 3: RETURN BUTTON */}
      <button
        onClick={handleReturnBook}
        className="bg-red-500 text-white px-4 py-2 mt-3 rounded"
      >
        Return Selected Book
      </button>
    </>
  )}

</div>

      {/* ➕ ADD BOOK */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">

        <h3 className="font-semibold mb-3">➕ Add Book</h3>

        <input
          placeholder="Title"
          value={title}
          onChange={e=>setTitle(e.target.value)}
          className="border p-2 mr-2"
        />

        <input
          placeholder="Author"
          value={author}
          onChange={e=>setAuthor(e.target.value)}
          className="border p-2 mr-2"
        />

        <input
          placeholder="Copies"
          value={copies}
          onChange={e=>setCopies(e.target.value)}
          className="border p-2 mr-2"
        />

        <button
          onClick={addBook}
          className="bg-green-500 text-white px-4 py-2 mt-2"
        >
          Add
        </button>

      </div>

      {/* ❌ DELETE BOOK */}
      <div className="bg-white p-6 rounded-xl shadow">

        <h3 className="font-semibold mb-3">❌ Delete Book</h3>

        <input
          placeholder="Search Book..."
          value={searchDelete}
          onChange={e=>handleDeleteSearch(e.target.value)}
          className="border p-2 w-full mb-2"
        />

        {searchDelete && (
          <div className="border max-h-40 overflow-y-auto mb-2">

            {filteredDelete.length === 0 && (
              <p className="p-2 text-gray-500">No books found</p>
            )}

            {filteredDelete.map(b=>(
              <div
                key={b._id}
                onClick={()=>{
                  setSelectedDelete(b._id);
                  setSearchDelete(b.title);
                  setFilteredDelete([]);
                }}
                className="p-2 hover:bg-gray-200 cursor-pointer"
              >
                {b.title} ({b.availableCopies})
              </div>
            ))}

          </div>
        )}

        <button
          onClick={deleteBook}
          className="bg-red-500 text-white px-4 py-2 mt-2 rounded"
        >
          Delete Book
        </button>

      </div>

    </div>
  );
}

export default AdminDashboard;