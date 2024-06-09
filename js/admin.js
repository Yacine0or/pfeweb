document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();
    
    var username = document.getElementById("user").value;
    var password = document.getElementById("password").value;
    
    if (username === 'admin' && password === 'umbb') {
        // Redirect to Registration.html upon successful login
        window.location.href = "Registration.html";
    } else {
        alert("Invalid username or password!");
    }
});