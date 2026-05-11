import { Link } from 'react-router-dom';
import Stars from './Stars';

export default function BusinessCard({ business }) {
  return (
    <Link to={`/business/${business.id}`}>
      <div className="business-card bg-white">
        <img
          src={business.image_url || 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?w=400&h=300&fit=crop'}
          alt={business.name}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{business.name}</h3>
          <div className="flex items-center gap-2 mb-2">
            <Stars rating={business.rating} />
            <span className="text-sm text-gray-600">({business.review_count})</span>
          </div>
          <p className="text-sm text-gray-600 mb-2">{business.category}</p>
          <p className="text-sm text-gray-700">{business.address}</p>
          <p className="text-sm text-gray-600">{business.city}, {business.state} {business.zip_code}</p>
        </div>
      </div>
    </Link>
  );
}
