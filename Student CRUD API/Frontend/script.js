const API = "https://studentrecords-ula6.onrender.com/api/students";
var currentPage = 1;
var currentSearch = "";

function checkAuth() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "login.html";
  }
  return token;
}

const token = checkAuth();

const fetchData = async (search = "", page = 1) => {
  currentPage = page;
  currentSearch = search;
  try {
    const response = await fetch(
      `${API}?search=${encodeURIComponent(search)}&page=${page}&limit=5`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    // console.log(data);
    if (data.message === "invalid or expired token") {
      window.location.href = "login.html";
    }
    const tbody = document.getElementById("studentTableBody");
    tbody.innerHTML = "";

    data.Students.map((item, index) => {
      const tr = document.createElement("tr");
      tr.innerHTML = "";
      tr.innerHTML = `
    <td><img width="50px" height="50px" style="border-radius:50%" src="https://studentrecords-ula6.onrender.com/public/${item.profile_pic}"/></td>
    <td>${item.first_name}</td>
    <td>${item.last_name}</td>
    <td>${item.email}</td>
    <td>${item.phone}</td>
    <td>${item.gender}</td>
   <td>
   <button class="btn btn-info btn-sm" onclick="viewStudent('${item._id}')">View</button>
   <button class="btn btn-warning btn-sm" onclick="editStudent('${item._id}')">Edit</button>
   <button class="btn btn-danger btn-sm" onclick="deleteStudent('${item._id}')">Delete</button>
   </td> `;

      tbody.appendChild(tr);
    });
    renderPagination(data.totalPage);
  } catch (error) {
    if (error.status === 401 || error.status === 403) {
      window.location.href = "login.html";
    }
    console.log("Error", error.message);
  }
};
fetchData();

function renderPagination(totalPage) {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";
  //Previous Page
  const prevli = document.createElement("li");
  prevli.className = "page-item " + (currentPage === 1 ? "disabled" : "");
  prevli.innerHTML = `<a class="page-link" href="#">Prev</a>`;
  prevli.addEventListener("click", (e) => {
    e.preventDefault();
    fetchData(currentSearch, currentPage - 1);
  });
  pagination.appendChild(prevli);

  //For Loop
  for (let i = 1; i <= totalPage; i++) {
    const li = document.createElement("li");
    li.className = "page-item " + (i === currentPage ? "active" : "");
    li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
    li.addEventListener("click", (e) => {
      e.preventDefault();
      fetchData(currentSearch, i);
    });
    pagination.appendChild(li);
  }
  //Next button
  const nextli = document.createElement("li");
  nextli.className =
    "page-item " + (currentPage === totalPage ? "disabled" : "");
  nextli.innerHTML = `<a class="page-link" href="#">Next</a>`;
  nextli.addEventListener("click", (e) => {
    e.preventDefault();
    fetchData(currentSearch, currentPage + 1);
  });
  pagination.appendChild(nextli);
}
//view student
async function viewStudent(id) {
  const response = await fetch(`${API}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const student = await response.json();
  console.log(student);
  document.querySelector(
    "#viewProfilePic"
  ).src = `https://studentrecords-ula6.onrender.com/public/${student.profile_pic}`;
  document.querySelector(
    "#viewName"
  ).textContent = `${student.first_name} ${student.last_name}`;
  document.querySelector("#viewEmail").textContent = student.email;
  document.querySelector("#viewPhone").textContent = student.phone;
  document.querySelector("#viewGender").textContent = student.gender;
  new bootstrap.Modal(document.querySelector("#viewStudentModal")).show();
}

async function editStudent(id) {
  try {
    const response = await fetch(`${API}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const student = await response.json();

    document.querySelector("#editStudentId").value = student._id;
    document.querySelector("#editFirstName").value = student.first_name;
    document.querySelector("#editLastName").value = student.last_name;
    document.querySelector("#editEmail").value = student.email;
    document.querySelector("#editPhone").value = student.phone;
    document.querySelector("#editGender").value = student.gender;
    new bootstrap.Modal(document.querySelector("#editStudentModal")).show();
  } catch (error) {
    console.log("Error:", error.message);
  }
}

//update student Record
document
  .querySelector("#editStudentForm")
  .addEventListener("submit", async function (e) {
    try {
      e.preventDefault();
      const id = document.querySelector("#editStudentId").value;
      const formData = new FormData(this);
      console.log(formData);

      const res = await fetch(`${API}/${id}`, {
        method: "PUT",
        body: formData,
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        bootstrap.Modal.getInstance(
          document.querySelector("#editStudentModal")
        ).hide();
        fetchData();
      } else {
        bootstrap.Modal.getInstance(
          document.querySelector("#editStudentModal")
        ).hide();
        alert("Data not updated");
      }
    } catch (error) {
      console.log("Error:", error.message);
    }
  });

//Add Student
document
  .querySelector("#addStudentForm")
  .addEventListener("submit", async function (e) {
    try {
      new bootstrap.Modal(document.querySelector("#addStudentModal")).show();
      e.preventDefault();
      const formData = new FormData(this);
      console.log(Object.fromEntries(formData));
      const res = await fetch(API, {
        method: "POST",
        body: formData,
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        this.reset();
        bootstrap.Modal.getInstance(
          document.querySelector("#addStudentModal")
        ).hide();
        fetchData();
      } else {
        bootstrap.Modal.getInstance(
          document.querySelector("#addStudentModal")
        ).hide();
        alert("Data not submitted");
      }
    } catch (error) {
      console.log("Error:", error.message);
    }
  });

//delete student
async function deleteStudent(id) {
  if (confirm("Are you sure to delete student?")) {
    const res = await fetch(`${API}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchData();
  }
}

//Search student
document.getElementById("searchInput").addEventListener("input", (e) => {
  fetchData(e.target.value);
});
//Logout
function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}
