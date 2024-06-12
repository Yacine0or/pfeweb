
let currentGroup = '';
// Simulated data for groups with justification details
const groupData = {
    group1: {
        attendance: [
            { firstName: "stud1", lastName: "1", matricule: "202031030001" },
            { firstName: "stud2", lastName: "2", matricule: "202031030002" }
        ],
        absence: [
            {
                firstName: "stud3",
                lastName: "3",
                matricule: "202031030003",
                justificationPdf: "justifications/stud3.pdf",
                justificationStatus: "" // Empty by default
            },
            {
                firstName: "stud4",
                lastName: "4",
                matricule: "202031030004",
                justificationPdf: "justifications/stud4.pdf",
                justificationStatus: "" // Empty by default
            }
        ]
    },
    group2: {
        attendance: [
            { firstName: "stud5", lastName: "5", matricule: "202031030005" },
            { firstName: "stud6", lastName: "6", matricule: "202031030006" }
        ],
        absence: [
            {
                firstName: "stud7",
                lastName: "7",
                matricule: "202031030007",
                justificationPdf: "justifications/stud7.pdf",
                justificationStatus: "" // Empty by default
            },
            {
                firstName: "stud8",
                lastName: "8",
                matricule: "202031030008",
                justificationPdf: "justifications/stud8.pdf",
                justificationStatus: "" // Empty by default
            }
        ]
    }
};

// Function to populate the absence table with "View PDF" and justification status
function populateAbsenceTable(absenceData) {
    const absenceTableBody = document.getElementById("absence-body");

    // Clear existing content
    absenceTableBody.innerHTML = '';

    // Populate the absence table with justification button and radio buttons
    absenceData.forEach(student => {
        const row = document.createElement("tr");

        const justificationStatusColor = 
            student.justificationStatus === "accepted" ? "green" :
            student.justificationStatus === "rejected" ? "red" :
            "black"; // Default color for empty status

        row.innerHTML = `
            <td>${student.firstName}</td>
            <td>${student.lastName}</td>
            <td>${student.matricule}</td>
            <td><button class="btn" onclick="viewJustification('${student.justificationPdf}')">View PDF</button></td>
            <td style="color: ${justificationStatusColor};">
                <input type="radio" name="justification-${student.matricule}" value="accepted"> Accepted
                <input type="radio" name="justification-${student.matricule}" value="rejected"> Rejected
            </td>
        `;

        // Attach event listeners to radio buttons
        row.querySelectorAll('input[type="radio"]').forEach(radio => {
            radio.addEventListener('change', () => {
                student.justificationStatus = radio.value; // Update justification status
                const color = radio.value === "accepted" ? "green" : "red";
                row.querySelector('td:last-child').style.color = color;
            });
        });

        absenceTableBody.appendChild(row);
    });
}

// Function to open justification PDFs in a new tab
function viewJustification(pdfUrl) {
    window.open(pdfUrl, "_blank"); // Opens the PDF in a new tab/window
}

// Function to populate the attendance table
function populateAttendanceTable(attendanceData) {
    const attendanceTableBody = document.getElementById("attendance-body");

    // Clear existing content
    attendanceTableBody.innerHTML = '';

    // Populate the attendance table
    attendanceData.forEach(student => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${student.firstName}</td>
            <td>${student.lastName}</td>
            <td>${student.matricule}</td>
        `;

        attendanceTableBody.appendChild(row);
    });
}

// Function to fetch and show group data
function showGroupData(groupName) {
    const group = groupData[groupName];
    if (!group) return;

    currentGroup = groupName; 

    populateAttendanceTable(group.attendance);
    populateAbsenceTable(group.absence);
}

// Event listener for group buttons to switch between groups
document.querySelector('.group-buttons').addEventListener('click', function(event) {
    if (event.target.tagName === 'BUTTON') {
        const groupName = event.target.innerText.toLowerCase();
        showGroupData(groupName);
    }
});
