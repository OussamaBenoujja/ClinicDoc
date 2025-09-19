export function renderClinicCalendar(container, clinicApp) {
    container.innerHTML = "";

    let today = new Date();
    let currentMonth = today.getMonth();
    let currentYear = today.getFullYear();

    let monthYear = document.createElement("h2");
    monthYear.id = "month-year";
    container.appendChild(monthYear);

    let table = document.createElement("table");
    container.appendChild(table);

    let thead = document.createElement("thead");
    table.appendChild(thead);

    let headerRow = document.createElement("tr");
    let days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    days.forEach(day => {
        let th = document.createElement("th");
        th.textContent = day;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    let tbody = document.createElement("tbody");
    tbody.id = "calendar-body";
    table.appendChild(tbody);

    let appointmentsList = document.createElement("div");
    appointmentsList.id = "appointments-list";
    container.appendChild(appointmentsList);

    function showAppointmentsForDay(day, month, year) {
        appointmentsList.innerHTML = "";
        let selectedDate = new Date(year, month, day);

        let appointments = (clinicApp.appointments || []).filter(a => {
            let aDate = new Date(a.date);
            return aDate.getFullYear() === year &&
                   aDate.getMonth() === month &&
                   aDate.getDate() === day;
        });

        let title = document.createElement("h3");
        title.textContent = `Appointments for ${day}/${month+1}/${year}`;
        appointmentsList.appendChild(title);

        if (appointments.length === 0) {
            let none = document.createElement("div");
            none.textContent = "No appointments on this day.";
            appointmentsList.appendChild(none);
        } else {
            appointments.forEach(a => {
                let form = document.createElement("form");
                form.style.marginBottom = "12px";

                let patient = document.createElement("div");
                patient.textContent = `Patient: ${a.patient?.fullName || ""}`;
                form.appendChild(patient);

                let practitioner = document.createElement("div");
                practitioner.textContent = `Practitioner: ${a.practitioner}`;
                form.appendChild(practitioner);

                let time = document.createElement("div");
                let aDate = new Date(a.date);
                time.textContent = `Time: ${aDate.toLocaleTimeString()}`;
                form.appendChild(time);

                let notes = document.createElement("div");
                notes.textContent = `Notes: ${a.notes}`;
                form.appendChild(notes);

                let status = document.createElement("div");
                status.textContent = `Status: ${a.status || "confirmed"}`;
                form.appendChild(status);

                form.appendChild(document.createElement("hr"));

                appointmentsList.appendChild(form);
            });
        }
    }

    function renderCalendar(month, year) {
        monthYear.textContent = `${["January","February","March","April","May","June","July","August","September","October","November","December"][month]} ${year}`;
        tbody.innerHTML = "";

        let firstDay = new Date(year, month, 1).getDay();
        let daysInMonth = new Date(year, month + 1, 0).getDate();

        let date = 1;
        for (let i = 0; i < 6; i++) {
            let row = document.createElement("tr");
            for (let j = 0; j < 7; j++) {
                if (i === 0 && j < firstDay) {
                    let cell = document.createElement("td");
                    cell.textContent = "";
                    row.appendChild(cell);
                } else if (date > daysInMonth) {
                    let cell = document.createElement("td");
                    cell.textContent = "";
                    row.appendChild(cell);
                } else {
                    let cell = document.createElement("td");
                    cell.textContent = date;
                    cell.style.cursor = "pointer";
                    cell.addEventListener("click", () => {
                        showAppointmentsForDay(date, month, year);
                    });
                    row.appendChild(cell);
                    date++;
                }
            }
            tbody.appendChild(row);
        }
    }

    renderCalendar(currentMonth, currentYear);
}