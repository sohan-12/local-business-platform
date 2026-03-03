const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "login.html";
}

const payload = JSON.parse(atob(token.split(".")[1]));

if (payload.role !== "admin") {
  alert("Access denied");
  window.location.href = "home.html";
}

fetch("http://local-business-platform.onrender.com/api/businesses")
.then(res => res.json())
.then(data => {

  const list = document.getElementById("adminBusinessList");

  data.forEach(b => {

    list.innerHTML += `
      <div class="card">

        <h3>${b.name}</h3>
        <p>${b.category}</p>
        <p>${b.price_range}</p>

        <button onclick="deleteBusiness(${b.id})">
        Delete
        </button>

      </div>
    `;

  });

});

function deleteBusiness(id) {

  fetch(`http://local-business-platform.onrender.com/api/businesses/delete/${id}`, {
    method: "DELETE"
  })
  .then(() => {
    alert("Business deleted");
    location.reload();
  });

}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}
