document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("notification-form");
    const sentNotifications = document.getElementById("sent-notifications");

    // Event listener for form submission
    form.addEventListener("submit", function(event) {
        event.preventDefault(); // Prevents actual form submission to keep it client-side

        // Get form inputs
        const recipient = document.getElementById("recipient").value;
        const message = document.getElementById("message").value;

        // Simple validation to ensure the message is not empty
        if (message.trim() === "") {
            alert("Please enter a message to send.");
            return;
        }

        // Create a new notification to display
        const newNotification = document.createElement("div");
        newNotification.className = "notification";
        newNotification.textContent = `To: ${recipient} - Message: ${message}`;

        // Append the new notification to the list of sent notifications
        sentNotifications.appendChild(newNotification);

        // Clear the text area after sending
        document.getElementById("message").value = "";
    });

    // Event listener for the logout link
    document.getElementById("logout").addEventListener("click", function(event) {
        event.preventDefault();
        alert("Logging out...");
        // Additional logout logic can go here
    });
});
