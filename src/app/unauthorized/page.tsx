import React from 'react';
import Link from 'next/link';

const UnauthorizedPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white shadow-xl rounded-lg">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Unauthorized Access</h1>
        <p className="text-xl text-gray-700 mb-6">
          Sorry, you do not have permission to access this page.
        </p>
        <div className="space-y-4">
          <Link href="/" className="block w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300">
            Go to Home
          </Link>
          <Link href="/login" className="block w-full py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;