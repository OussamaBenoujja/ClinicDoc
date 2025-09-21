import { clinicApp, createPatient, createAppointment, createReceipt, isLoggedIn, setIsLoggedIn } from "./main.js";
import { showAppointmentsSection } from "./appointments.js";
import { showMainDashboard } from "./mainDash.js";
import { showPatientsSection } from "./patients.js";
import { showReceiptsSection } from "./receipts.js";

export function dashboard() {
    document.body.innerHTML = "";

    
    const navbar = document.createElement("nav");
    navbar.id = "dashboard-navbar";

    const settingsBtn = document.createElement("button");
    settingsBtn.id = "settings-btn";
    settingsBtn.textContent = "Settings";

    const logoutBtn = document.createElement("button");
    logoutBtn.id = "logout-btn";
    logoutBtn.textContent = "Logout";

    navbar.appendChild(settingsBtn);
    navbar.appendChild(logoutBtn);

    
    const main = document.createElement("main");
    main.id = "dashboard-main";

   
    const sidePanel = document.createElement("aside");
    sidePanel.id = "dashboard-side-panel";

    const dashboardBtn = document.createElement("button");
    dashboardBtn.id = "dashboard-btn";
    dashboardBtn.textContent = "Dashboard";

    const patientsBtn = document.createElement("button");
    patientsBtn.id = "patients-btn";
    patientsBtn.textContent = "Patients";

    const appointmentsBtn = document.createElement("button");
    appointmentsBtn.id = "appointments-btn";
    appointmentsBtn.textContent = "Appointments";

    const receiptsBtn = document.createElement("button");
    receiptsBtn.id = "receipts-btn";
    receiptsBtn.textContent = "Expenses & Recettes";

    
    sidePanel.appendChild(dashboardBtn);
    sidePanel.appendChild(appointmentsBtn);
    sidePanel.appendChild(patientsBtn);
    sidePanel.appendChild(receiptsBtn);

    
    const showcase = document.createElement("section");
    showcase.id = "dashboard-showcase";

   
    main.appendChild(sidePanel);
    main.appendChild(showcase);

    
    document.body.appendChild(navbar);
    document.body.appendChild(main);

    
    dashboardBtn.addEventListener("click", () => showMainDashboard(showcase));
    patientsBtn.addEventListener("click", () => showPatientsSection(showcase, sidePanel));
    appointmentsBtn.addEventListener("click", () => showAppointmentsSection(showcase, sidePanel));
    receiptsBtn.addEventListener("click", () => showReceiptsSection(showcase, sidePanel));
    logoutBtn.addEventListener("click", () => {
        setIsLoggedIn(false);
        location.reload();
    });
 

    showMainDashboard(showcase, sidePanel);
}
