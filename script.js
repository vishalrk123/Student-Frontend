// ==================================================
// SPRING BOOT API URL
// ==================================================

const API_URL = "http://localhost:8080/students";

// ==================================================
// LOAD ALL STUDENTS
// ==================================================

async function loadStudents() {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Failed to load students");
    }

    const students = await response.json();

    const table = document.getElementById("studentTable");

    table.innerHTML = "";

    if (students.length === 0) {
      table.innerHTML = `
                <tr>
                    <td colspan="4">
                        No students found
                    </td>
                </tr>
            `;

      return;
    }

    students.forEach((student) => {
      const row = document.createElement("tr");

      row.innerHTML = `

                <td>${student.id}</td>

                <td>${student.name}</td>

                <td>${student.email}</td>

                <td>${student.course}</td>

            `;

      table.appendChild(row);
    });
  } catch (error) {
    console.error(error);

    alert("Unable to connect to Spring Boot API.");
  }
}

// ==================================================
// ADD STUDENT
// ==================================================

document
  .getElementById("studentForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value;

    const email = document.getElementById("email").value;

    const course = document.getElementById("course").value;

    const student = {
      name: name,

      email: email,

      course: course,
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(student),
      });

      if (!response.ok) {
        throw new Error("Failed to add student");
      }

      const result = await response.json();

      document.getElementById("message").textContent =
        "Student added successfully! ID: " + result.id;

      document.getElementById("studentForm").reset();

      // Refresh student list

      await loadStudents();
    } catch (error) {
      console.error(error);

      document.getElementById("message").textContent = "Failed to add student.";
    }
  });

// ==================================================
// UPDATE STUDENT
// ==================================================

document
  .getElementById("updateForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const id = document.getElementById("updateId").value;

    const name = document.getElementById("updateName").value;

    const email = document.getElementById("updateEmail").value;

    const course = document.getElementById("updateCourse").value;

    const student = {
      name: name,

      email: email,

      course: course,
    };

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(student),
      });

      if (response.status === 404) {
        document.getElementById("updateMessage").textContent =
          "Student not found.";

        return;
      }

      if (!response.ok) {
        throw new Error("Failed to update student");
      }

      await response.json();

      document.getElementById("updateMessage").textContent =
        "Student updated successfully!";

      document.getElementById("updateForm").reset();

      await loadStudents();
    } catch (error) {
      console.error(error);

      document.getElementById("updateMessage").textContent =
        "Failed to update student.";
    }
  });

// ==================================================
// LOAD DATA WHEN PAGE OPENS
// ==================================================

loadStudents();
