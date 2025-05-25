import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // 🔁 Redirect otomatis jika sudah login
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      navigate(user.role === "admin" ? "/admin" : "/dashboard");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("Respon login:", data);

      if (!res.ok) {
        setError(data.error || "Login gagal");
      } else {
        // Simpan token & user ke localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Navigasi sesuai role
        navigate(data.user.role === "admin" ? "/admin" : "/dashboard");
      }
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan saat login");
    }
  };

  return (
    <div className="bg-gradient-to-br from-sky-200 to-indigo-300 min-h-screen flex items-center justify-center font-sans">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">Login</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
          <button type="submit" className="w-full bg-indigo-500 text-white p-2 rounded hover:bg-indigo-600">
            Login
          </button>
        </form>

        <p className="text-center mt-4">
          Belum punya akun?{" "}
          <a href="/register" className="text-indigo-600 hover:underline">
            Daftar
          </a>
        </p>
      </div>
    </div>
  );
}