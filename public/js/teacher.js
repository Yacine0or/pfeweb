document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();
    
    var username = document.getElementById("user").value;
    var password = document.getElementById("password").value;
    
    if (username === 'teacher' && password === 'umbb') {
        // Redirect to Registration.html upon successful login
        window.location.href = "../public/Teacher/index.html";
    } else {
        alert("Invalid username or password!");
    }
});