const API_URL = "https://studentrecords-ula6.onrender.com/api/users";

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
//console.log(loginForm, registerForm);

if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.querySelector("#Username").value;
    const email = document.querySelector("#email").value;
    const pwd = document.querySelector("#pwd").value;

    const res = await fetch(`${API_URL}/register`, {
      method: "POST",
      body: JSON.stringify({ username, email, password: pwd }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();

    if (res.ok) {
      alert("Accout created Successfuly!");
      window.location.href = "login.html";
    } else {
      alert(data.message || "Registration Failed");
    }
  });
}

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.querySelector("#Username").value;
    const pwd = document.querySelector("#pwd").value;

    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      body: JSON.stringify({ username, password: pwd }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token);
      window.location.href = "index.html";
    } else {
      alert(data.message || "Login Failed");
    }
  });
}
