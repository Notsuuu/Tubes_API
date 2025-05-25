import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import MapView from '../components/MapView';
import Chatbot from '../components/Chatbot';

export default function Dashboard() {
  const [userName, setUserName] = useState('');
  const [umkmList, setUmkmList] = useState([]); // hasil pencarian dari chatbot

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.name) setUserName(user.name);
  }, []);

    const handleLogout = () => {
      localStorage.removeItem("user");
      navigate("/login");
    };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 text-white">
      <Navbar userName={userName} onLogout={handleLogout} />

      <div className="flex flex-col md:flex-row h-[calc(100vh-80px)] px-4">
        {/* Map */}
        <div className="w-full md:w-2/3 h-[300px] md:h-full p-2">
          <MapView umkmData={umkmList} />
        </div>

        {/* Chatbot */}
        <div className="w-full md:w-1/3 h-[400px] md:h-full bg-white text-black p-4 rounded-lg shadow overflow-y-auto">
          <h2 className="text-lg font-bold mb-4">Asisten UMKM</h2>
          <Chatbot onSelectResults={setUmkmList} />
        </div>
      </div>
    </div>
  );
}
