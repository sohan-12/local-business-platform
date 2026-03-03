// ================= SECURITY CHECK =================

const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "login.html";
}

let payload;

try {
  payload = JSON.parse(atob(token.split(".")[1]));
} catch (err) {
  localStorage.clear();
  window.location.href = "login.html";
}

// Only Admin Can Access
if (payload.role !== "admin") {
  alert("Access denied. Admin only.");
  window.location.href = "home.html";
}


// ================= ADD BUSINESS =================

const form = document.getElementById("businessForm");

if (form) {

  form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const data = {

      owner_id: payload.id,

      name: document.getElementById("name").value,
      category: document.getElementById("category").value,
      description: document.getElementById("description").value,
      address: document.getElementById("address").value,
      latitude: document.getElementById("latitude").value,
      longitude: document.getElementById("longitude").value,
      phone: document.getElementById("phone").value,
      price_range: document.getElementById("price_range").value,
      image_url: document.getElementById("image_url").value 

    };

    try {

      const res = await fetch(
        "http://local-business-platform.onrender.com/api/businesses/add",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        }
      );

      if (res.ok) {

        alert("Business added successfully");

        // After add → go back to admin dashboard
        window.location.href = "admin.html";

      } else {

        alert("Error adding business");

      }

    } catch (err) {

      console.error(err);
      alert("Server error");

    }

  });

}


// ================= GO BACK BUTTON =================

function goBack() {
  window.location.href = "admin.html";
}
