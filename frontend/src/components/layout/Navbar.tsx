import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckSquare, User, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold text-indigo-600">
              <CheckSquare className="w-6 h-6" />
              TaskFlow
            </Link>
            <div className="hidden md:flex ml-10 space-x-4">
              <Link to="/dashboard" className="px-3 py-2 text-gray-700 hover:text-indigo-600 transition-colors">
                Dashboard
              </Link>
              <Link to="/tasks" className="px-3 py-2 text-gray-700 hover:text-indigo-600 transition-colors">
                All Tasks
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <>
                <div className="flex items-center gap-2 text-gray-700">
                  <User className="w-5 h-5" />
                  <span className="hidden md:inline">{user.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden md:inline">Logout</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};