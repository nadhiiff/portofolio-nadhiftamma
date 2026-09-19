import React from 'react';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  const handleGoBack = () => {
    window.history.back();
  };

  const handleGoHome = () => {
    // In a real app, you would use your router's navigation
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="text-center">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-cream mb-4 animate-bounce font-heading">
            404
          </h1>
          <div className="w-24 h-1 bg-maroon mx-auto rounded-full"></div>
        </div>

        {/* Message */}
        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-cream mb-4 font-heading">
            Oops! Halaman Tidak Ditemukan
          </h2>
          <p className="text-lg text-muted max-w-md mx-auto leading-relaxed font-body">
            Halaman yang Anda cari mungkin telah dipindahkan, dihapus, atau tidak pernah ada.
          </p>
        </div>

        {/* Illustration */}
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto bg-surface rounded-full flex items-center justify-center mb-6">
            <div className="text-6xl">🔍</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 px-6 py-3 bg-surface text-cream rounded-lg hover:bg-surface/80 transition-colors duration-200 shadow-md hover:shadow-lg border border-maroon/20 font-body"
          >
            <ArrowLeft size={20} />
            Kembali
          </button>
          
          <button
            onClick={handleGoHome}
            className="flex items-center gap-2 px-6 py-3 bg-maroon text-cream rounded-lg hover:bg-maroon/80 transition-colors duration-200 shadow-md hover:shadow-lg font-body"
          >
            <Home size={20} />
            Beranda
          </button>
        </div>

       

      </div>
    </div>
  );
}