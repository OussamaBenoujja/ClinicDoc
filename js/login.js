import { clinicApp, createPassword, setIsLoggedIn } from "./main.js";
import { dashboard } from "./dashboard.js";

clinicApp.loadFromLocalStorage();

function createMainLayout() {
  document.body.innerHTML = "";

  const mainForm = document.createElement("div");
  mainForm.id = "mainForm";
  const login = document.createElement("div");
  login.id = "loginForm";
  const logo = document.createElement("div");
  logo.id = "logoSpot";
  const logoImage = document.createElement("img");
  logoImage.src = "./assets/logo.png";
  logoImage.alt = "Clinic-Doc Logo";
  logo.appendChild(logoImage);
  mainForm.appendChild(login);
  mainForm.appendChild(logo);
  document.body.appendChild(mainForm);

  return login;
}

function showCreatePassword() {
  const login = createMainLayout();

  const formTitle = document.createElement('h2');
  formTitle.innerText = "New Login";
  formTitle.id = 'formTitle';
  
  const newPassword = document.createElement("input");
  newPassword.type = "password";
  newPassword.placeholder = "New Password";
  newPassword.name = 'newPassword';

  const confirmPassword = document.createElement("input");
  confirmPassword.type = "password";
  confirmPassword.placeholder = "Confirm Password";

  const submit = document.createElement("button");
  submit.textContent = "Submit";
  
  login.appendChild(formTitle);
  login.appendChild(newPassword);
  login.appendChild(confirmPassword);
  login.appendChild(submit);

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
  const login = createMainLayout();

  const formTitle = document.createElement('h2');
  formTitle.innerText = "Log In";
  formTitle.id = 'formTitle';
  
  const enterPassword = document.createElement("input");
  enterPassword.type = "password";
  enterPassword.placeholder = "Enter Password";
  enterPassword.name = 'newPassword';
  
  const enterPasswordLabel = document.createElement('label');
  enterPasswordLabel.setAttribute('for','newPassword');
  enterPasswordLabel.innerText = 'Enter Password';
  
  const submit = document.createElement("button");
  submit.textContent = "Submit";

  const holder = document.createElement('div');
  holder.id = 'holder_';
  
  login.appendChild(formTitle);
  holder.appendChild(enterPasswordLabel);
  holder.appendChild(enterPassword);
  login.appendChild(holder);
  login.appendChild(submit);

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