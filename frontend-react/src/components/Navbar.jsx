import { Link } from "react-router-dom";
import UserMenu from "./UserMenu";

export default function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <nav className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4 flex justify-between items-center text-white">
      <h1 className="text-xl font-bold">Chatbot UMKM Palu</h1>

      <div className="space-x-4">
        {user ? (
          <UserMenu />
        ) : (
          <>
            <Link to="/login" className="bg-white text-indigo-600 px-4 py-2 rounded hover:bg-gray-100">Login</Link>
            <Link to="/register" className="bg-white text-indigo-600 px-4 py-2 rounded hover:bg-gray-100">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
