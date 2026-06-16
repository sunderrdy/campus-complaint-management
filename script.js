let selectedIssue = "";

/* ---------------- LOGIN ---------------- */

async function studentLogin() {

    let username =
    document.getElementById("username").value;

    let password =
    document.getElementById("password").value;

    const response =
    await fetch(
    "https://campus-backend-qpso.onrender.com/students"
     );

    const students =
    await response.json();

    const student =
    students.find(
        s =>
        s.username === username &&
        s.password === password
    );

    if(student){

        localStorage.setItem(
            "currentUser",
            username
        );

        window.location.href =
        "dashboard.html";

    }
    else{

        alert(
            "Invalid Username or Password"
        );

    }
}

/* ---------------- SIGNUP ---------------- */

async function signup() {

    let username =
    document.getElementById("newUsername").value;

    let password =
    document.getElementById("newPassword").value;

    if(username === "" || password === ""){

        alert("Fill all fields");

        return;
    }

    let student = {

        username: username,

        password: password

    };

    await fetch(
    "https://campus-backend-qpso.onrender.com/students",
    {
            method: "POST",

            headers: {
                "Content-Type":
                "application/json"
            },

            body:
            JSON.stringify(student)
        }
    );

    alert(
    "Registration Successful"
    );

    window.location =
    "student-login.html";

}

/* ---------------- ISSUE SELECTION ---------------- */

function selectissue(issue) {

    selectedIssue = issue;

    document.getElementById("complaintTitle").value = issue;

    alert("Selected Issue: " + issue);
}

/* ---------------- ISSUE CONFIRM ---------------- */

function confirmIssue() {

    if (selectedIssue === "") {

        alert("Please select an issue");

    } else {

        alert(
            "Issue selected successfully!\nIssue: " +
            selectedIssue
        );
    }
}

/* ---------------- SUBMIT COMPLAINT ---------------- */

async function submitComplaint() {

    let title =
    document.getElementById(
    "complaintTitle"
    ).value;

    let description =
    document.getElementById(
    "complaintDescription"
    ).value;

    if(title === "" || description === ""){

        alert(
        "Please fill all fields"
        );

        return;
    }

    let currentUser =
    localStorage.getItem(
    "currentUser"
    );

    let complaint = {

        username:
        currentUser,

        title:
        title,

        description:
        description,

        status:
        "Pending"

    };

    await fetch(
       "https://campus-backend-qpso.onrender.com/complaints",
        {

            method:"POST",

            headers:{
                "Content-Type":
                "application/json"
            },

            body:
            JSON.stringify(
                complaint
            )

        }
    );

    alert(
    "Complaint Submitted Successfully"
    );

    document.getElementById(
    "complaintTitle"
    ).value = "";

    document.getElementById(
    "complaintDescription"
    ).value = "";

    loadComplaints();
}

/* ---------------- STUDENT COMPLAINT LIST ---------------- */

async function loadComplaints() {

    let currentUser =
    localStorage.getItem(
        "currentUser"
    );

    const response =
await fetch(
"https://campus-backend-qpso.onrender.com/complaints"
);

    const complaints =
    await response.json();

    let html = "";

    complaints.forEach(c => {

        if(c.username === currentUser){

            html += `
            <tr>
                <td>${c.id}</td>
                <td>${c.title}</td>
                <td>${c.status}</td>
            </tr>
            `;
        }

    });

    document.getElementById(
        "complaintList"
    ).innerHTML = html;
}

/* ---------------- ADMIN LOGIN ---------------- */

async function adminLogin() {

    let username =
    document.getElementById("adminUser").value.trim();

    let password =
    document.getElementById("adminPass").value.trim();

    const response =
    await fetch(
    "https://campus-backend-qpso.onrender.com/admins"
    );

    const admins =
    await response.json();

    console.log("Admins:", admins);

    const admin =
    admins.find(a =>
        a.username === username &&
        a.password === password
    );

    console.log("Matched:", admin);

    if(admin){

        localStorage.setItem(
        "adminUser",
        admin.username
        );

        localStorage.setItem(
        "adminRole",
        admin.role
        );

        alert("Admin Login Successful");

        window.location.href =
        "admin.html";

    }else{

        alert("Invalid Admin Login");

    }
}

/* ---------------- ADMIN DASHBOARD ---------------- */

async function loadAdminComplaints() {

    const response =
await fetch(
"https://campus-backend-qpso.onrender.com/complaints"
);

    const complaints =
    await response.json();

    let html = "";

    complaints.forEach(c => {

        html += `
        <tr>

            <td>${c.id}</td>

            <td>${c.title}</td>

            <td>${c.status}</td>

            <td>

                <select onchange="updateStatus('${c.id}', this.value)">

                    <option value="Pending"
                    ${c.status === "Pending" ? "selected" : ""}>
                    Pending
                    </option>

                    <option value="In Progress"
                    ${c.status === "In Progress" ? "selected" : ""}>
                    In Progress
                    </option>

                    <option value="Resolved"
                    ${c.status === "Resolved" ? "selected" : ""}>
                    Resolved
                    </option>

                </select>

                <br><br>

                <button onclick="deleteComplaint('${c.id}')">
                    Delete
                </button>

            </td>

<td>
<span class="status-${c.status.replace(' ','')}">
${c.status}
</span>
</td>

        </tr>
        `;
    });

    document.getElementById(
        "adminComplaints"
    ).innerHTML = html;
}

/* ---------------- UPDATE STATUS ---------------- */

async function updateStatus(id, status) {

    await fetch(
        `https://campus-backend-qpso.onrender.com/complaints/${id}`,
        {
            method: "PATCH",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                status: status
            })
        }
    );

    alert("Status Updated");

    loadAdminComplaints();

    if(typeof dashboardStats === "function"){
        dashboardStats();
    }
}

/* ---------------- NOTIFICATIONS ---------------- */

function loadNotifications() {

    let notifications =
        JSON.parse(localStorage.getItem("notifications")) || [];

    let html = "";

    notifications.forEach(n => {

        html += `<li>${n}</li>`;

    });

    document.getElementById("notificationList").innerHTML = html;
}

/* ---------------- PAGE LOAD ---------------- */

async function dashboardStats() {

    const response =
    await fetch(
    "https://campus-backend-qpso.onrender.com/complaints"
    );

    const complaints =
    await response.json();

    let total = complaints.length;

    let pending =
    complaints.filter(
    c => c.status === "Pending"
    ).length;

    let progress =
    complaints.filter(
    c => c.status === "In Progress"
    ).length;

    let resolved =
    complaints.filter(
    c => c.status === "Resolved"
    ).length;

    document.getElementById(
    "totalComplaints"
    ).innerHTML = total;

    document.getElementById(
    "pendingComplaints"
    ).innerHTML = pending;

    document.getElementById(
    "progressComplaints"
    ).innerHTML = progress;

    document.getElementById(
    "resolvedComplaints"
    ).innerHTML = resolved;
}

dashboardStats();

loadAdminComplaints();

function logout() {

    localStorage.removeItem(
        "currentUser"
    );

    window.location =
        "index.html";
}

window.onload = function(){

    if(document.getElementById("adminComplaints")){
        loadAdminComplaints();
        dashboardStats();
    }

    if(document.getElementById("welcomeAdmin")){
        showAdminInfo();
    }

    if(document.getElementById("complaintList")){
        loadComplaints();
    }

    if(document.getElementById("notificationList")){
        loadNotifications();
    }

}

async function loadNotifications(){

    const response =
    await fetch(
    "https://campus-backend-qpso.onrender.com/notifications"
    );

    const notifications =
    await response.json();

    let html = "";

    notifications.forEach(n => {

        html += `
        <li>${n.message}</li>
        `;

    });

    document.getElementById(
    "notificationList"
    ).innerHTML = html;
}

function logout(){

    localStorage.removeItem(
    "currentUser"
    );

    window.location.href =
    "index.html";
}

async function deleteComplaint(id){

    if(!confirm("Delete Complaint?")){
        return;
    }

    try{

        const response = await fetch(
            `https://campus-backend-qpso.onrender.com/complaints/${id}`,
            {
                method: "DELETE"
            }
        );

        if(response.ok){

            alert("Complaint Deleted Successfully");

            loadAdminComplaints();

            if(typeof dashboardStats === "function"){
                dashboardStats();
            }

        }else{

            alert("Delete Failed");
            console.log(await response.text());

        }

    }catch(error){

        console.error(error);
        alert("Error deleting complaint");

    }

}

async function dashboardStats(){

    const response =
    await fetch(
    "https://campus-backend-qpso.onrender.com/complaints"
    );

    const complaints =
    await response.json();

    document.getElementById("totalComplaints").innerHTML =
    complaints.length;

    document.getElementById("pendingComplaints").innerHTML =
    complaints.filter(
        c => c.status === "Pending"
    ).length;

    document.getElementById("progressComplaints").innerHTML =
    complaints.filter(
        c => c.status === "In Progress"
    ).length;

    document.getElementById("resolvedComplaints").innerHTML =
    complaints.filter(
        c => c.status === "Resolved"
    ).length;
}

function searchComplaint(){

    let input =
    document.getElementById(
    "searchBox"
    ).value.toLowerCase();

    let rows =
    document.querySelectorAll(
    "#adminComplaints tr"
    );

    rows.forEach(row=>{

        let text =
        row.innerText.toLowerCase();

        row.style.display =
        text.includes(input)
        ? ""
        : "none";

    });

}

async function loadNotifications(){

    const response =
    await fetch(
    "https://campus-backend-qpso.onrender.com/notifications"
    );

    const notifications =
    await response.json();

    let html = "";

    notifications.forEach(n=>{

        html += `
        <li>${n.message}</li>
        `;

    });

    document.getElementById(
    "notificationList"
    ).innerHTML = html;
}

function showAdminRole(){

    let role =
    localStorage.getItem(
        "adminRole"
    );

    if(
        document.getElementById(
        "adminRole"
        )
    ){

        document.getElementById(
        "adminRole"
        ).innerHTML =
        "Role: " + role;

    }
} 

function showAdminInfo(){

    let user =
    localStorage.getItem(
    "adminUser"
    );

    let role =
    localStorage.getItem(
    "adminRole"
    );

    if(
    document.getElementById(
    "welcomeAdmin"
    )
    ){

        document.getElementById(
        "welcomeAdmin"
        ).innerHTML =
        "Welcome " +
        user +
        " (" +
        role +
        ")";
    }
}