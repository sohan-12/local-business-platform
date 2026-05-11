import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchBusinesses } from '../lib/supabase';
import BusinessCard from '../components/BusinessCard';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  const query = searchParams.get('q') || '';

  useEffect(() => {
    loadResults();
  }, [query]);

  const loadResults = async () => {
    try {
      setLoading(true);
      const data = await fetchBusinesses(query, '');
      setBusinesses(data);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Search Results</h1>
      <p className="text-gray-600 mb-6">Results for "{query}"</p>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Searching...</p>
        </div>
      ) : businesses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses.map((business) => (
            <BusinessCard key={business.id} business={business} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No results found for "{query}"</p>
        </div>
      )}
    </div>
  );
}
