import { useState, useEffect } from 'react';
import { fetchBusinesses } from '../lib/supabase';
import BusinessCard from '../components/BusinessCard';

export default function HomePage() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    loadBusinesses();
  }, [selectedCategory]);

  const loadBusinesses = async () => {
    try {
      setLoading(true);
      const data = await fetchBusinesses('', selectedCategory);
      setBusinesses(data);
    } catch (error) {
      console.error('Error loading businesses:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['Restaurant', 'Coffee Shop', 'Shopping', 'Service', 'Entertainment'];

  return (
    <div>
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Discover Local Businesses</h1>
          <p className="text-xl text-gray-300">Find the best restaurants, shopping, services and more</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Browse by Category</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                selectedCategory === '' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === cat ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading businesses...</p>
          </div>
        ) : businesses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businesses.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No businesses found. Add some data to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}
