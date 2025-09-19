import { clinicApp, createPassword, setIsLoggedIn } from "./main.js";
import { dashboard } from "./dashboard.js";

clinicApp.loadFromLocalStorage();

function showCreatePassword() {
  document.body.innerHTML = "";
  const login = document.createElement("div");
  const newPassword = document.createElement("input");
  const confirmPassword = document.createElement("input");
  const submit = document.createElement("button");

  newPassword.type = "password";
  newPassword.placeholder = "New Password";
  confirmPassword.type = "password";
  confirmPassword.placeholder = "Confirm Password";
  submit.textContent = "Submit";

  login.appendChild(newPassword);
  login.appendChild(confirmPassword);
  login.appendChild(submit);
  document.body.appendChild(login);

  submit.addEventListener("click", () => {
    const pw1 = newPassword.value || "";
    const pw2 = confirmPassword.value || "";
    if (pw1.length > 8 && pw1 === pw2) {
      createPassword(pw1);
      const res = clinicApp.unlockWithPassword(pw1);
      if (res.ok) {
        setIsLoggedIn(true);
        dashboard();
      } else {
        alert("Initialization failed.");
      }
    } else {
      alert("Passwords do not match or are too short (min 9).");
    }
  });
}

function showLogin() {
  document.body.innerHTML = "";
  const login = document.createElement("div");
  const enterPassword = document.createElement("input");
  const submit = document.createElement("button");

  enterPassword.type = "password";
  enterPassword.placeholder = "Enter Password";
  submit.textContent = "Submit";

  login.appendChild(enterPassword);
  login.appendChild(submit);
  document.body.appendChild(login);

  submit.addEventListener("click", () => {
    const pw = enterPassword.value || "";
    const check = clinicApp.verifyPassword(pw);
    if (!check.ok) {
      if (check.reason === "locked") {
        const sec = Math.max(0, Math.ceil((check.lockedUntil - Date.now()) / 1000));
        alert(`Locked. Try again in ~${sec} seconds.`);
      } else if (check.reason === "mismatch") {
        alert("Wrong password.");
      } else {
        alert("No password set. Create a new one.");
        showCreatePassword();
      }
      return;
    }
    const res = clinicApp.unlockWithPassword(pw);
    if (res.ok) {
      setIsLoggedIn(true);
      dashboard();
    } else if (res.reason === "decrypt-failed") {
      alert("Decryption failed. Data might be corrupted.");
    } else {
      alert("Login failed.");
    }
  });
}

if (!clinicApp.pw || typeof clinicApp.pw.hash === "undefined") {
  showCreatePassword();
} else {
  showLogin();
}