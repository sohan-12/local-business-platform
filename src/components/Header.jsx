import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Header() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <Link to="/" className="text-3xl font-bold text-red-600">
            Yelp
          </Link>
          <nav className="flex gap-4">
            <button className="text-gray-700 hover:text-gray-900">Write a Review</button>
            <button className="text-gray-700 hover:text-gray-900">Log In</button>
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
