import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { signOut, getCurrentUser } from '../lib/auth';

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [tab, setTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const currentUser = await getCurrentUser();
      if (!currentUser?.is_admin) {
        navigate('/');
        return;
      }
      setUser(currentUser);

      const [bizData, userData, reviewData] = await Promise.all([
        supabase.from('businesses').select('*'),
        supabase.from('users').select('*'),
        supabase.from('reviews').select('*'),
      ]);

      setBusinesses(bizData.data || []);
      setUsers(userData.data || []);
      setReviews(reviewData.data || []);

      setStats({
        totalBusinesses: bizData.data?.length || 0,
        totalUsers: userData.data?.length || 0,
        totalReviews: reviewData.data?.length || 0,
        avgRating: (reviewData.data?.reduce((a, b) => a + b.rating, 0) / (reviewData.data?.length || 1) || 0).toFixed(1),
      });
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gray-900 text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-400">Welcome, {user?.name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          {['overview', 'businesses', 'users', 'reviews'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 font-semibold transition-colors ${
                tab === t
                  ? 'text-red-600 border-b-2 border-red-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {tab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600 mb-2">Total Businesses</p>
              <p className="text-4xl font-bold text-red-600">{stats.totalBusinesses}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600 mb-2">Total Users</p>
              <p className="text-4xl font-bold text-blue-600">{stats.totalUsers}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600 mb-2">Total Reviews</p>
              <p className="text-4xl font-bold text-green-600">{stats.totalReviews}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600 mb-2">Average Rating</p>
              <p className="text-4xl font-bold text-yellow-600">{stats.avgRating}</p>
            </div>
          </div>
        )}

        {tab === 'businesses' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold">Name</th>
                  <th className="px-6 py-3 text-left font-semibold">Category</th>
                  <th className="px-6 py-3 text-left font-semibold">City</th>
                  <th className="px-6 py-3 text-left font-semibold">Rating</th>
                  <th className="px-6 py-3 text-left font-semibold">Reviews</th>
                </tr>
              </thead>
              <tbody>
                {businesses.map((biz) => (
                  <tr key={biz.id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4">{biz.name}</td>
                    <td className="px-6 py-4">{biz.category}</td>
                    <td className="px-6 py-4">{biz.city}</td>
                    <td className="px-6 py-4">{biz.rating.toFixed(1)}</td>
                    <td className="px-6 py-4">{biz.review_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'users' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold">Name</th>
                  <th className="px-6 py-3 text-left font-semibold">Email</th>
                  <th className="px-6 py-3 text-left font-semibold">Admin</th>
                  <th className="px-6 py-3 text-left font-semibold">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4">{u.name}</td>
                    <td className="px-6 py-4">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        u.is_admin ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {u.is_admin ? 'Admin' : 'User'}
                      </span>
                    </td>
                    <td className="px-6 py-4">{new Date(u.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'reviews' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold">Title</th>
                  <th className="px-6 py-3 text-left font-semibold">Rating</th>
                  <th className="px-6 py-3 text-left font-semibold">Helpful</th>
                  <th className="px-6 py-3 text-left font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((rev) => (
                  <tr key={rev.id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4">{rev.title}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1">
                        {'★'.repeat(rev.rating)}
                        {'☆'.repeat(5 - rev.rating)}
                      </span>
                    </td>
                    <td className="px-6 py-4">{rev.helpful_count}</td>
                    <td className="px-6 py-4">{new Date(rev.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
