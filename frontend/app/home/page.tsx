'use client';

import React from 'react';
import Link from 'next/link';

const HomePage: React.FC = () => {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-100">
      <h1 className="text-4xl font-bold mb-4 text-center text-blue-600">Welcome to EventEase 🎉</h1>
      <p className="text-lg text-gray-700 mb-6 text-center">
        Book your favorite event tickets hassle-free!
      </p>
      <div className="flex gap-4">
        <Link href="/login" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">
          Login
        </Link>
        <Link href="/register" className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded">
          Register
        </Link>
      </div>
    </main>
  );
};

export default HomePage;
