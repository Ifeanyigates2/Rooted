import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X, Heart, User } from 'lucide-react';

const Header = () => {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Rooted</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <button className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 rounded-md">
              <Heart className="h-4 w-4" />
              <span>Favorites</span>
            </button>
            
            <Link href="/account">
              <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700">
                <User className="h-4 w-4" />
                <span>Account</span>
              </button>
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-2">
              <button className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 rounded-md">
                <Heart className="h-4 w-4" />
                <span>Favorites</span>
              </button>
              
              <Link href="/account">
                <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 w-full">
                  <User className="h-4 w-4" />
                  <span>Account</span>
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;