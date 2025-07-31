import React from 'react';
import { Link } from 'wouter';
import { Bell, Search, User } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-gray-900">rooted.</span>
            </div>
          </Link>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100">
              <Bell className="h-5 w-5" />
            </button>
            
            <button className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100">
              <Search className="h-5 w-5" />
            </button>
            
            <Link href="/login">
              <button className="flex items-center space-x-2 bg-gray-900 text-white px-4 py-2 rounded-full hover:bg-gray-800 transition-colors">
                <span className="text-sm">Sign in</span>
                <User className="h-4 w-4" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;