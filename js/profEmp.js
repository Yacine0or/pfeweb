// Constants
const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const coursesByDay = {};

// DOM References
const todayLabel = document.getElementById('todayLabel');
const dateLabel = document.getElementById('dateLabel');
const daysContainer = document.getElementById('daysContainer');
const scheduleContainer = document.getElementById('scheduleContainer');
const scheduleHeading = document.getElementById('scheduleHeading');

// Initialization
updateDate();
generateDays();

// Functions

// Update date display
function updateDate() {
    const now = new Date();
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    const formattedDate = now.toLocaleDateString('en-US', options);
    dateLabel.textContent = formattedDate;
}

// Generate days buttons
function generateDays() {
    const today = new Date();
    for (let i = 0; i < 7; i++) {
        const nextDay = new Date(today);
        nextDay.setDate(today.getDate() + i);
        const dayNumber = nextDay.getDate();
        const dayName = daysOfWeek[nextDay.getDay()];

        const button = document.createElement('button');
        button.classList.add('day');
        button.textContent = `${dayName} ${dayNumber}${i === 0 ? ' (Today)' : ''}`;
        button.dataset.day = dayName;
        button.addEventListener('click', () => selectDay(button));
        daysContainer.appendChild(button);
    }
}

// Select day button
function selectDay(button) {
    const dayButtons = document.querySelectorAll('.day');
    dayButtons.forEach(btn => btn.classList.remove('clicked'));
    button.classList.add('clicked');
    const dayName = button.dataset.day;
    displaySchedule(dayName);
}

// Add a course
function addCourse() {
    const form = document.getElementById('courseForm');
    const formData = new FormData(form);

    const daySelected = document.querySelector('.day.clicked');
    if (!daySelected) {
        alert("Please select a day.");
        return;
    }

    const dayName = daySelected.dataset.day;
    const courseTime = formData.get('timeC');
    const course = {
        time: courseTime,
        name: formData.get('courseName'),
        type: formData.get('courseType'),
        room: formData.get('courseRoom'),
        branch: formData.get('courseBranch'),
        group: formData.get('courseGroup')
    };

    if (!coursesByDay[dayName]) {
        coursesByDay[dayName] = [];
    }

    const existingCourseIndex = coursesByDay[dayName].findIndex(c => c.time === courseTime);
    if (existingCourseIndex !== -1) {
        coursesByDay[dayName][existingCourseIndex] = course;
    } else {
        coursesByDay[dayName].push(course);
    }

    coursesByDay[dayName].sort((a, b) => (a.time > b.time) ? 1 : -1);

    displaySchedule(dayName);
    form.reset();
    scheduleHeading.textContent = '';
}

// Display schedule for a specific day
function displaySchedule(dayName) {
    scheduleContainer.innerHTML = ''; // Clear previous schedule

    if (!coursesByDay[dayName] || coursesByDay[dayName].length === 0) {
        return; // No need to display anything if there are no courses
    }

    const dayCourses = coursesByDay[dayName];
    const daySchedule = document.createElement('div');
    daySchedule.innerHTML = `<h3>This is the timetable for ${dayName}:</h3>`;
    const table = document.createElement('table');
    table.innerHTML = `
        <tr>
            <th>Time</th>
            <th>Course Name</th>
            <th>Type</th>
            <th>Branch</th>
            <th>Group</th>
            <th>Room</th>
            ${dayName === daysOfWeek[new Date().getDay()] ? // Check if it's today
        '<th>QR Code</th>'
        : ''} <!-- Add QR Code column header only for today -->
        </tr>`;
    dayCourses.forEach(course => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${course.time}</td>
            <td>${course.name}</td>
            <td>${course.type}</td>
            <td>${course.branch}</td>
            <td>${course.group}</td>
            <td>${course.room}</td>
            ${dayName === daysOfWeek[new Date().getDay()] ? // Check if it's today
        `<td>
                    <div id="qrCode_${course.time.replace(':', '-')}" class="qr-code"></div> <!-- Empty div for QR code -->
                    <button class="generate-qr-button" onclick="generateQRCode('${dayName}', '${course.time}', '${course.name}', '${course.type}', '${course.branch}', '${course.group}', '${course.room}')">Generate QR</button>
                </td>`
        : ''}`; // Add QR code button and empty div for QR code only for today
        table.appendChild(row);
    });
    daySchedule.appendChild(table);
    scheduleContainer.appendChild(daySchedule);
}

// Generate QR code
function generateQRCode(dayName, time, name, type, branch, group, room) {
    const code = generateRandomCode(); // Generate a random code
    const qrCodeDivId = `qrCode_${time.replace(':', '-')}`;
    const qrCodeDiv = document.getElementById(qrCodeDivId);
    qrCodeDiv.innerHTML = ''; // Clear previous QR code

    // Create a container div for the QR code and button
    const containerDiv = document.createElement('div');
    containerDiv.classList.add('qr-container');

    // Create the QR code
    const qr = new QRCode(containerDiv, {
        text: code,
        width: 200, // Set the QR code width
        height: 200, // Set the QR code height
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });

    // Append the QR code container to the QR code div
    qrCodeDiv.appendChild(containerDiv);

    // Create an exit button
    const exitButton = document.createElement('button');
    exitButton.textContent = 'Exit';
    exitButton.classList.add('exit-button');
    exitButton.addEventListener('click', function () {
        qrCodeDiv.innerHTML = ''; // Clear the QR code when the exit button is clicked
    });

    // Append the QR code and exit button to the container
    containerDiv.appendChild(exitButton);
    qrCodeDiv.appendChild(containerDiv);
}

// Generate random code
function generateRandomCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const length = 10;
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

// Get the time rank
function getTimeRank(time) {
    switch (time) {
        case '08:00 - 09:30':
            return 1;
        case '09:40 - 11:10':
            return 2;
        case '11:20 - 12:50':
            return 3;
        case '13:00 - 14:30':
            return 4;
        case '14:40 - 16:10':
            return 5;
        case '16:20 - 17:50':
            return 6;
        default:
            return -1;
    }
}

// Get current date
function getDate() {
    const now = new Date();
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const day = now.getDate();
    const monthIndex = now.getMonth();
    return `${daysOfWeek[now.getDay()]} ${day} ${monthNames[monthIndex]}`;
}
