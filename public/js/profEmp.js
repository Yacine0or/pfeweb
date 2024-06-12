import { db, collection, getDocs, setDoc, doc } from './../../js/firebase.js';

// Constants
const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// DOM References
const todayLabel = document.getElementById('todayLabel');
const dateLabel = document.getElementById('dateLabel');
const daysContainer = document.getElementById('daysContainer');
const scheduleContainer = document.getElementById('scheduleContainer');
const scheduleHeading = document.getElementById('scheduleHeading');

// Initialization
updateDate();
generateDays();
fetchCourses();

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
    
    const daySelectedInput = document.querySelector('#daySelected');
    daySelectedInput.value = dayName;

    displaySchedule(dayName);
}

// Collection reference
const colRefSe = collection(db, 'séances');

// Generate a random hexadecimal ID with length 10
function generateRandomId(length = 10) {
    const characters = '0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters[Math.floor(Math.random() * characters.length)];
    }
    return result;
}

async function addCourse() {
    const form = document.querySelector('#courseForm');
    const formData = new FormData(form);

    const courseData = {
        id: generateRandomId(),
        day: formData.get('daySelected'),
        time: formData.get('timeC'),
        name: formData.get('courseName'),
        type: formData.get('courseType'),
        branch: formData.get('courseBranch'),
        group: formData.get('courseGroup'),
        room: formData.get('courseRoom'),
        qr: toHexString(formData.get('daySelected'), formData.get('timeC'), formData.get('courseName'), formData.get('courseType'),formData.get('courseBranch'), formData.get('courseGroup'), formData.get('courseRoom')),
    };

    try {
        await setDoc(doc(colRefSe, courseData.id), courseData, { merge: false });
        console.log("Course added to Firestore");
        
        form.reset();
        await fetchCourses(); // Refresh courses after adding a new one
    } catch (error) {
        console.error("Error adding course to Firestore: ", error);
    }
}

document.querySelector('#courseForm').addEventListener('submit', (e) => {
    e.preventDefault();
    addCourse();
});

const coursesByDay = {};

async function fetchCourses() {
    const querySnapshot = await getDocs(collection(db, 'séances'));
    querySnapshot.forEach((doc) => {
        const course = doc.data();
        const dayName = course.day;
        if (!coursesByDay[dayName]) {
            coursesByDay[dayName] = [];
        }
        coursesByDay[dayName].push(course);
    });

    // Display the schedule for the currently selected day
    const selectedDay = document.querySelector('.day.clicked')?.dataset.day;
    if (selectedDay) {
        displaySchedule(selectedDay);
    }
}

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
            ${dayName === daysOfWeek[new Date().getDay()] ?
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
            ${dayName === daysOfWeek[new Date().getDay()] ? 
            `<td>
                <div id="qrCode_${course.time.replace(':', '-')}" class="qr-code"></div> <!-- Empty div for QR code -->
                <button class="generate-qr-button" data-day="${dayName}" data-time="${course.time}" data-name="${course.name}" data-type="${course.type}" data-branch="${course.branch}" data-group="${course.group}" data-room="${course.room}">Generate QR</button>
            </td>`
            : ''}`; 
        table.appendChild(row);
    });
    daySchedule.appendChild(table); 
    scheduleContainer.appendChild(daySchedule);

    // Attach event listeners for the QR code buttons
    const qrButtons = document.querySelectorAll('.generate-qr-button');
    qrButtons.forEach(button => {
        button.addEventListener('click', () => {
            const dayName = button.dataset.day;
            const time = button.dataset.time;
            const name = button.dataset.name;
            const type = button.dataset.type;
            const branch = button.dataset.branch;
            const group = button.dataset.group;
            const room = button.dataset.room;
            generateQRCode(dayName, time, name, type, branch, group, room);
        });
    });
}

// Generate QR code
function generateQRCode(dayName, time, name, type, branch, group, room) {
    const hexString = toHexString(dayName, time, name, type, branch, group, room);
    const stringHex = fromHexString(hexString);
    console.log("Hexadecimal String:", hexString); 
    console.log("String Hexadecimal:", stringHex); 
    const qrCodeDivId = `qrCode_${time.replace(':', '-')}`;
    const qrCodeDiv = document.getElementById(qrCodeDivId);
    qrCodeDiv.innerHTML = ''; 

    // Create a container div for the QR code and button
    const containerDiv = document.createElement('div');
    containerDiv.classList.add('qr-container');

    // Create the QR code
    const qr = new QRCode(containerDiv, {
        text: hexString,
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

function toHexString(dayName, time, name, type, branch, group, room) {
    const dataString = `${dayName}|${time}|${name}|${type}|${branch}|${group}|${room}`;
    let hexString = '';
    for (let i = 0; i < dataString.length; i++) {
        hexString += dataString.charCodeAt(i).toString(16).padStart(2, '0');
    }
    return hexString;
}

function fromHexString(hexString) {
    let dataString = '';
    for (let i = 0; i < hexString.length; i += 2) {
        dataString += String.fromCharCode(parseInt(hexString.substr(i, 2), 16));
    }
    return dataString;
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
