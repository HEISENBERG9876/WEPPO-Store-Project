document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("register-form");
    
    if (registerForm) {
        registerForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;

            try {
                const response = await fetch("/api/auth/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password })
                });

                const data = await response.json();
                
                if (response.ok) {
                    alert("Registration successful! Redirecting to login...");
                    window.location.href = "/login";
                }
                else{
                    alert(`Error: ${data.error}`);
                }
            } catch (error) {
                console.error("Registration error:", error);
                alert("Something went wrong. Try again.");
            }
        });
    }
});
