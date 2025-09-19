import { clinicApp, createPatient, createAppointment, createReceipt, isLoggedIn, setIsLoggedIn} from "./main.js";


import {showAppointmentsSection} from "./appointments.js";
import {showMainDashboard}       from "./mainDash.js";
import {showPatientsSection}     from "./patients.js";
import {showReceiptsSection}     from "./receipts.js";



export function dashboard() {
    document.body.innerHTML = "";
    const main = document.createElement("div");
    const nav = document.createElement("div");
    document.body.appendChild(main);    
    const dashboardBtn = document.createElement("button");
    dashboardBtn.textContent = "Dashboard";
    const patientsBtn = document.createElement("button");
    patientsBtn.textContent = "Patients";
    const appointmentsBtn = document.createElement("button");
    appointmentsBtn.textContent = "Appointments";
    const receiptsBtn = document.createElement("button");
    receiptsBtn.textContent = "Expenses & Recettes";
    const logOut = document.createElement('button');
    logOut.textContent = 'LogOut';
    nav.appendChild(dashboardBtn);
    nav.appendChild(patientsBtn);
    nav.appendChild(appointmentsBtn);
    nav.appendChild(receiptsBtn);
    nav.appendChild(logOut);
    main.appendChild(nav);
 
    dashboardBtn.addEventListener("click",() =>  showMainDashboard(main, nav));
    patientsBtn.addEventListener("click",() =>  showPatientsSection(main, nav));
    appointmentsBtn.addEventListener("click",() =>  showAppointmentsSection(main, nav));
    receiptsBtn.addEventListener("click",() =>  showReceiptsSection(main, nav));
    logOut.addEventListener('click',()=>{
        setIsLoggedIn(false);
        location.reload();
    })

    showMainDashboard(main, nav);
}