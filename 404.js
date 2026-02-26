if (navigator.userAgent) {
    document.getElementById("userAgent").textContent = `User agent: ${navigator.userAgent}`;
} else {
    document.getElementById("userAgent").textContent = "User agent data not available.";
};