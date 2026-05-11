import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchBusiness, fetchBusinessReviews, insertReview } from '../lib/supabase';
import Stars from '../components/Stars';

export default function BusinessDetail() {
  const { id } = useParams();
  const [business, setBusiness] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [formData, setFormData] = useState({ rating: 5, title: '', content: '' });

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const biz = await fetchBusiness(id);
      setBusiness(biz);
      const revs = await fetchBusinessReviews(id);
      setReviews(revs);
    } catch (error) {
      console.error('Error loading business:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      // In a real app, you'd get the actual user ID from auth
      const tempUserId = '00000000-0000-0000-0000-000000000000';
      await insertReview(id, tempUserId, formData.rating, formData.title, formData.content);
      setFormData({ rating: 5, title: '', content: '' });
      setShowReviewForm(false);
      loadData();
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-12 text-center">Loading...</div>;
  }

  if (!business) {
    return <div className="max-w-7xl mx-auto px-4 py-12 text-center">Business not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <img
          src={business.image_url || 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?w=800&h=400&fit=crop'}
          alt={business.name}
          className="w-full h-96 object-cover rounded-lg mb-6"
        />
        
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">{business.name}</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Stars rating={business.rating} size="lg" />
                <span className="text-lg font-semibold">{business.rating.toFixed(1)}</span>
              </div>
              <span className="text-gray-600">({business.review_count} reviews)</span>
            </div>
          </div>
          <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            Call
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Info</h3>
            <p className="text-gray-700 mb-2">{business.address}</p>
            <p className="text-gray-700 mb-2">{business.city}, {business.state} {business.zip_code}</p>
            {business.phone && <p className="text-gray-700 mb-2">{business.phone}</p>}
            {business.website && <p className="text-blue-600">{business.website}</p>}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Category</h3>
            <p className="text-gray-700">{business.category}</p>
            {business.description && (
              <>
                <h3 className="font-semibold text-gray-900 mt-4 mb-2">About</h3>
                <p className="text-gray-700">{business.description}</p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="border-t pt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Reviews</h2>
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Write a Review
          </button>
        </div>

        {showReviewForm && (
          <form onSubmit={handleSubmitReview} className="mb-8 p-4 bg-gray-50 rounded-lg">
            <div className="mb-4">
              <label className="block font-semibold mb-2">Rating</label>
              <select
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} Stars</option>)}
              </select>
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-2">Your Review</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg h-24"
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                Post
              </button>
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <Stars rating={review.rating} />
                    <p className="font-semibold text-lg mt-2">{review.title}</p>
                  </div>
                  <span className="text-sm text-gray-600">{new Date(review.created_at).toLocaleDateString()}</span>
                </div>
                <p className="text-gray-700 mb-2">{review.content}</p>
                <p className="text-sm text-gray-600">{review.users?.name || 'Anonymous'}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center py-8">No reviews yet. Be the first to review!</p>
        )}
      </div>
    </div>
  );
}
