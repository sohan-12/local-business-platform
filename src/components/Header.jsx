import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { signOut } from '../lib/auth';

export default function Header() {
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('auth_id', session.user.id)
          .maybeSingle();
        setUser(data);
      } else {
        setUser(null);
      }
    });

    return () => authListener?.subscription?.unsubscribe();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setUser(null);
      setShowMenu(false);
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <Link to="/" className="text-3xl font-bold text-red-600">
            Local Business Platform
          </Link>
          <nav className="flex gap-4 items-center">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span className="text-gray-700">{user.name}</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </button>
                {showMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                    {user.is_admin && (
                      <Link
                        to="/admin/dashboard"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 border-b"
                        onClick={() => setShowMenu(false)}
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 font-semibold"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>

        <form onSubmit={handleSearch} className="flex gap-3">
          <input
            type="text"
            placeholder="Find Restaurants, Shopping, Services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
          >
            Search
          </button>
        </form>
      </div>
    </header>
  );
}
