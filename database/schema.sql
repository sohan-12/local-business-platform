CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role VARCHAR(20) DEFAULT 'USER',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE businesses (

  id SERIAL PRIMARY KEY,

  owner_id INT REFERENCES users(id),

  name VARCHAR(255) NOT NULL,

  category VARCHAR(100) NOT NULL,

  description TEXT,

  address TEXT,

  latitude DECIMAL(10,8),

  longitude DECIMAL(11,8),

  phone VARCHAR(20),

  price_range VARCHAR(10),

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  business_id INTEGER REFERENCES businesses(id),
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE admin_logs (
  id SERIAL PRIMARY KEY,
  admin_id INTEGER REFERENCES users(id),
  action TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
