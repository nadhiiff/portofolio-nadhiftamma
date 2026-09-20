import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../supabase'; // Sesuaikan path ini jika supabase.js kamu ada di folder berbeda

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      // Mengambil sesi user yang sedang aktif
      const { data: { session } } = await supabase.auth.getSession();
      
      // Mengambil email admin dari .env
      const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;

      // Cek apakah ada sesi dan apakah emailnya cocok dengan admin
      if (session && session.user.email === adminEmail) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Tampilan saat mengecek status (bisa disesuaikan)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-8 h-8 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Jika tidak valid, tendang ke login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Jika valid, izinkan masuk ke Dashboard
  return children;
}