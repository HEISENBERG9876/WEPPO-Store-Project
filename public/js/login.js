document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");

    if (loginForm) {
        loginForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;

            try {
                const response = await fetch("/api/auth/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password }),
                    credentials: "include"
                });
                const data = await response.json();

                if (response.ok) {
                    window.location.href = "/";
                } else {
                    alert(`Error: ${data.error}`);
                }
            } catch (error) {
                alert("Something went wrong in login.js" + e);
            }
        });
    }
});
