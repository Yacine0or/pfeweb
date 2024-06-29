

var opt = document.getElementById("viewGroup")

opt.onchange = function(){
    displayScheduleForGroup()
}

const groupSchedules = {
    'Group A': [],
    'Group B': [],
    'Group C': []
};
function generateRandomId(length = 10) {
    const characters = '0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters[Math.floor(Math.random() * characters.length)];
    }
    return result;
}


async function addCourse(event) {
    event.preventDefault()
    
    const group = document.getElementById("group").value;
    const dayOfWeek = document.getElementById("dayOfWeek").value;
    const courseTime = document.getElementById("courseTime").value;
    const courseName = document.getElementById("courseName").value;
    const courseType = document.getElementById("courseType").value;
    const courseRoom = document.getElementById("courseRoom").value;

    if (!group || !dayOfWeek || !courseTime || !courseName || !courseType || !courseRoom) {
        alert("Please fill out all fields.");
       
    }

    const schedule = groupSchedules[group];
    const existingCourse = schedule.find(
        course =>
            course.day === dayOfWeek &&
            course.time === courseTime
    );

    if (existingCourse) {
        alert("This time slot is already occupied in this group.");
        return;
    }

    schedule.push({
        day: dayOfWeek,
        time: courseTime,
        name: courseName,
        type: courseType,
        room: courseRoom
    });

    //win rahi f code te3 presence show




    // Reset form fields after adding a course
    document.getElementById("group").value = "";
    document.getElementById("dayOfWeek").value = "";
    document.getElementById("courseTime").value = "";
    document.getElementById("courseName").value = "";
    document.getElementById("courseType").value = "";
    document.getElementById("courseRoom").value = "";

    displayScheduleForGroup(); // Update the schedule with the latest information
}

function displayScheduleForGroup() {
    const selectedGroup = document.getElementById("viewGroup").value;
    const scheduleTable = document.getElementById("groupScheduleTable");

    const timeSlotIndex = {
        "08:00 - 09:30": 0,
        "09:40 - 11:10": 1,
        "11:20 - 12:50": 2,
        "13:00 - 14:30": 3,
        "14:40 - 16:10": 4,
        "16:20 - 17:50": 5
    };

    const dayIndex = {
        "Saturday": 1,
        "Sunday": 2,
        "Monday": 3,
        "Tuesday": 4,
        "Wednesday": 5,
        "Thursday": 6
    };

    // Clear existing rows in the schedule
    const tbody = scheduleTable.querySelector("tbody");
    for (let i = 0; i < tbody.rows.length; i++) {
        for (let j = 1; j < tbody.rows[i].cells.length; j++) {
            tbody.rows[i].cells[j].innerHTML = "";
        }
    }

    if (!selectedGroup) {
        return; // Do nothing if no group is selected
    }

    // Populate the table with the selected group's schedule
    const schedule = groupSchedules[selectedGroup];
    schedule.forEach(course => {
        const row = tbody.rows[timeSlotIndex[course.time]];
        const cell = row.cells[dayIndex[course.day]];

        cell.innerHTML = `
            ${course.name} (${course.type})<br>
            Room: ${course.room}
        `;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.onclick = () => {
            const index = schedule.findIndex(
                c =>
                    c.day === course.day &&
                    c.time === course.time &&
                    c.name === course.name
            );
            if (index > -1) {
                schedule.splice(index, 1); // Remove the course from the schedule
            }
            displayScheduleForGroup(); // Refresh the schedule after deletion
        };

        cell.appendChild(deleteButton);
    });
}

document.getElementById("addCourseButton").addEventListener("click", addCourse);