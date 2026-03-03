const API = "http://localhost:5000/api/businesses";

const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "login.html";
}

const payload = JSON.parse(atob(token.split(".")[1]));

let allBusinesses = [];

// ================= LOAD BUSINESSES =================

async function loadBusinesses() {
  try {
    const res = await fetch(API);
    const data = await res.json();

    if (!Array.isArray(data)) {
      console.error("Invalid business data:", data);
      return;
    }

    allBusinesses = data;
    showBusinesses(data);

  } catch (err) {
    console.error("LOAD ERROR:", err);
  }
}

// ================= SHOW BUSINESSES =================

async function showBusinesses(data) {

  const list = document.getElementById("businessList");
  list.innerHTML = "";

  if (data.length === 0) {
    list.innerHTML = "<p>No businesses found</p>";
    return;
  }

  for (const b of data) {

    // Fetch reviews for this business
    let reviews = [];
    try {
      const reviewRes = await fetch(`${API}/reviews/${b.id}`);
      reviews = await reviewRes.json();
    } catch (err) {
      console.error("Review fetch error:", err);
    }

    let reviewsHTML = "";

    if (!Array.isArray(reviews) || reviews.length === 0) {
      reviewsHTML = `<p class="no-review">No reviews yet</p>`;
    } else {

      reviews.forEach(r => {

        let deleteBtn = "";

        if (Number(r.user_id) === Number(payload.id)) {
          deleteBtn = `
            <button class="delete-btn"
              onclick="deleteReview(${r.id})">
              Delete
            </button>
          `;
        }

        reviewsHTML += `
          <div class="review-item">
            <strong>${r.user_name}</strong> ⭐ ${r.rating}
            <p>${r.comment}</p>
            <small>${new Date(r.created_at).toLocaleDateString()}</small>
            ${deleteBtn}
          </div>
        `;
      });
    }

    list.innerHTML += `
      <div class="card">

        <img 
          src="${b.image_url ? b.image_url : 'https://via.placeholder.com/300'}" 
          alt="${b.name}" 
          class="business-img">

        <h3>${b.name}</h3>

        <p class="avg-rating">⭐ ${parseFloat(b.average_rating).toFixed(1)}</p>

        <p><strong>Category:</strong> ${b.category}</p>
        <p><strong>Price:</strong> ${b.price_range}</p>
        <p><strong>Address:</strong> ${b.address}</p>

        <a target="_blank"
          href="https://www.google.com/maps?q=${b.latitude},${b.longitude}">
          View on Map
        </a>

        <hr>

        <h4>Reviews</h4>
        ${reviewsHTML}

        <hr>

        <h4>Add Review</h4>

        <select id="rating-${b.id}" class="input-field">
          <option value="">Select Rating</option>
          <option value="1">1 ⭐</option>
          <option value="2">2 ⭐</option>
          <option value="3">3 ⭐</option>
          <option value="4">4 ⭐</option>
          <option value="5">5 ⭐</option>
        </select>

        <textarea 
          id="comment-${b.id}" 
          placeholder="Write your review..."
          class="input-field textarea">
        </textarea>

        <button onclick="submitReview(${b.id})" class="submit-btn">
          Submit Review
        </button>

      </div>
    `;
  }
}

// ================= SUBMIT REVIEW =================

async function submitReview(businessId) {

  const rating = document.getElementById(`rating-${businessId}`).value;
  const comment = document.getElementById(`comment-${businessId}`).value;

  if (!rating || !comment) {
    alert("Please provide rating and comment");
    return;
  }

  try {
    await fetch(`${API}/review`, {
      method: "POST",
      headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        business_id: businessId,
        rating: rating,
        comment: comment
      })
    });

    alert("Review submitted!");
    loadBusinesses();

  } catch (err) {
    console.error("Submit error:", err);
  }
}

// ================= DELETE REVIEW =================

async function deleteReview(reviewId) {

  if (!confirm("Are you sure you want to delete this review?")) {
    return;
  }

  try {
    await fetch(`${API}/review/${reviewId}`, {
    method: "DELETE",
    headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  }
  });

    alert("Review deleted");
    loadBusinesses();

  } catch (err) {
    console.error("Delete error:", err);
  }
}

// ================= FILTER =================

function filterCategory(category) {
  if (category === "All") {
    showBusinesses(allBusinesses);
    return;
  }

  const filtered = allBusinesses.filter(
    b => b.category === category
  );

  showBusinesses(filtered);
}

// ================= SEARCH =================

function searchBusiness() {

  const value = document.getElementById("searchInput").value.toLowerCase();

  const filtered = allBusinesses.filter(b =>
    b.name.toLowerCase().includes(value)
  );

  showBusinesses(filtered);
}

// ================= LOGOUT =================

function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

loadBusinesses();