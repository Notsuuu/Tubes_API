import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 min-h-screen text-white">
      <header className="bg-transparent py-6 px-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-wide">Chatbot UMKM Palu</h1>
        <nav className="flex space-x-4">
          <Link to="/login" className="bg-white text-indigo-700 font-semibold px-4 py-2 rounded-full shadow-md hover:bg-black transition duration-700">Login</Link>
          <Link to="/register" className="bg-white text-indigo-700 font-semibold px-4 py-2 rounded-full shadow-md hover:bg-black transition duration-700">Register</Link>
        </nav>
      </header>

      <main className="flex flex-col items-center justify-center text-center px-4 py-24">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 drop-shadow-lg">
          Selamat Datang di <br /> Chatbot UMKM Palu
        </h2>
        <p className="text-lg md:text-xl mb-8 text-white/90 max-w-xl">
          Temukan berbagai usaha mikro kecil menengah di daerah Palu dan Sekitarnya dengan mudah dan cepat!
        </p>
      </main>
    </div>
  );
}
