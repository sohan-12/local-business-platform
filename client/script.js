const API = "local-business-platform.onrender.com/api/auth";


// ================= REGISTER =================
const registerForm = document.getElementById("registerForm");

if (registerForm) {

  registerForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch(`${API}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();

    alert(data.message || data.error);

  });

}


// ================= LOGIN =================
const loginForm = document.getElementById("loginForm");

if (loginForm) {

  loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {

      const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {

        localStorage.setItem("token", data.token);

        const payload = JSON.parse(atob(data.token.split(".")[1]));

        if (payload.role === "admin") {
          window.location.href = "admin.html";
        } else {
          window.location.href = "home.html";
        }

      } else {
        alert(data.error);
      }

    } catch (err) {
      console.error(err);
    }

  });

}


// ================= DASHBOARD (OLD dashboard.html support) =================
const dashboardTitle = document.getElementById("dashboardTitle");

if (dashboardTitle) {

  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "login.html";
  } else {

    fetch(`${API}/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      if (!res.ok) throw new Error("Invalid token");
      return res.json();
    })
    .then(user => {

      const nameEl = document.getElementById("name");
      const emailEl = document.getElementById("email");

      if (nameEl) nameEl.innerText = "Welcome, " + user.name;
      if (emailEl) emailEl.innerText = "Email: " + user.email;

    })
    .catch(() => {
      localStorage.removeItem("token");
      window.location.href = "login.html";
    });

  }

}


// ================= LOGOUT =================
function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}
