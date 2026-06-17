const getStartedBtn = document.querySelector(".primary-btn");
const signInBtn = document.querySelector(".secondary-btn");

getStartedBtn.addEventListener("click", () => {
    window.location.href = "signup.html";
});

signInBtn.addEventListener("click", () => {
    window.location.href = "login.html";
});