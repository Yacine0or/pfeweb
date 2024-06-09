function printGroupData() {
    // Check if a group has been selected
    if (!currentGroup) {
        alert("No group selected. Please select a group before printing data.");
        return;
    }

    // Get the current day and time
    const now = new Date();
    const dayOptions = { weekday: 'long' }; // To get the day name
    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit' }; // To get the time

    const dayName = now.toLocaleDateString('en-US', dayOptions); // Get the day name in English
    const currentTime = now.toLocaleTimeString('en-US', timeOptions); // Get the time in 12-hour format with AM/PM

    // Get data from attendance and absence tables
    const attendanceRows = document.getElementById('attendance-body').querySelectorAll('tr');
    const absenceRows = document.getElementById('absence-body').querySelectorAll('tr');

    // Prepare formatted text data for attendance
    let attendanceData = 'Attendance:\n';
    attendanceRows.forEach((row) => {
        const cells = row.querySelectorAll('td');
        attendanceData += `${cells[0].innerText} ${cells[1].innerText} - ${cells[2].innerText}\n`;
    });

    // Prepare formatted text data for absence with justification status
    let absenceData = 'Absence:\n';
    absenceRows.forEach((row) => {
        const cells = row.querySelectorAll('td');
        const justificationStatusElement = row.querySelector('input[name^="justification"]:checked');

        let justificationStatus;
        if (justificationStatusElement) {
            justificationStatus = justificationStatusElement.value === 'accepted' ? 'Accepted' : 'Rejected';
        } else {
            justificationStatus = "The decision has not been determined";
        }

        const studentInfo = `${cells[0].innerText} ${cells[1].innerText} - ${cells[2].innerText}`;
        absenceData += `${studentInfo} - Justification Status: ${justificationStatus}\n`;
    });

    // Include the day and time at the top of the text data
    const textData = `Printed on: ${dayName}, at ${currentTime}\n\nGroup: ${currentGroup}\n\n${attendanceData}\n${absenceData}`;

    // Create a Blob with the text data
    const blob = new Blob([textData], { type: 'text/plain' });

    // Create a download link and trigger the download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `group_data_${currentGroup}.txt`; // Include group name in the file name
    link.click(); // Trigger the download
    URL.revokeObjectURL(link.href); // Clean up the URL
}
