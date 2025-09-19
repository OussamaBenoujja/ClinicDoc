import { clinicApp, createPatient, createAppointment, createReceipt } from "./main.js";

export function showAppointmentsSection(main, nav) {
    main.innerHTML = "";
    main.appendChild(nav);

    const appointmentsSection = document.createElement("div");
    const titleRow = document.createElement("div");
    const title = document.createElement("h2");
    title.textContent = "Appointments";
    titleRow.appendChild(title);

    const addBtn = document.createElement("button");
    addBtn.textContent = "Add Appointment";
    titleRow.appendChild(addBtn);

    appointmentsSection.appendChild(titleRow);

    const practitionerFilter = document.createElement("select");
    const allPractitioners = [...new Set(clinicApp.appointments.map(a => a.practitioner))];
    practitionerFilter.innerHTML = `<option value="">All Practitioners</option>` +
        allPractitioners.map(p => `<option value="${p}">${p}</option>`).join('');
    appointmentsSection.appendChild(practitionerFilter);

    const statusFilter = document.createElement("select");
    const statusOptions = ["", "confirmed", "cancelled", "no-show"];
    statusFilter.innerHTML = statusOptions.map(s =>
        `<option value="${s}">${s === "" ? "All Statuses" : s.charAt(0).toUpperCase() + s.slice(1)}</option>`).join('');
    appointmentsSection.appendChild(statusFilter);

    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    const headers = [
        "Patient",
        "Practitioner",
        "Date",
        "Notes",
        "Status",
        "Created At",
        "Actions"
    ];
    headers.forEach(text => {
        const th = document.createElement("th");
        th.textContent = text;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    table.appendChild(tbody);

    appointmentsSection.appendChild(table);
    main.appendChild(appointmentsSection);

    function renderAppointmentsTable(appointments) {
        tbody.innerHTML = "";
        appointments.forEach((appointment, idx) => {
            const row = document.createElement("tr");

            const tdPatient = document.createElement("td");
            tdPatient.textContent = appointment.patient ? appointment.patient.fullName : "";
            row.appendChild(tdPatient);

            const tdPractitioner = document.createElement("td");
            tdPractitioner.textContent = appointment.practitioner;
            row.appendChild(tdPractitioner);

            const tdDate = document.createElement("td");
            tdDate.textContent = appointment.date
                ? new Date(appointment.date).toLocaleString()
                : "";
            row.appendChild(tdDate);

            const tdNotes = document.createElement("td");
            tdNotes.textContent = appointment.notes;
            row.appendChild(tdNotes);

            const tdStatus = document.createElement("td");
            tdStatus.textContent = appointment.status || "confirmed";
            row.appendChild(tdStatus);

            const tdCreated = document.createElement("td");
            tdCreated.textContent = appointment.createdAt
                ? new Date(appointment.createdAt).toLocaleString()
                : "";
            row.appendChild(tdCreated);

            const tdActions = document.createElement("td");
            const delBtn = document.createElement("button");
            delBtn.textContent = "🗑";
            delBtn.addEventListener("click", () => {
                clinicApp.appointments.splice(idx, 1);
                clinicApp.saveToLocalStorage();
                renderAppointmentsTable(applyFilters());
            });
            tdActions.appendChild(delBtn);

            row.appendChild(tdActions);
            tbody.appendChild(row);
        });
    }

    function applyFilters() {
        return clinicApp.appointments.filter(a => {
            const practitionerOk = !practitionerFilter.value || a.practitioner === practitionerFilter.value;
            const statusOk = !statusFilter.value || (a.status || "confirmed") === statusFilter.value;
            return practitionerOk && statusOk;
        });
    }

    practitionerFilter.addEventListener("change", () => renderAppointmentsTable(applyFilters()));
    statusFilter.addEventListener("change", () => renderAppointmentsTable(applyFilters()));

    renderAppointmentsTable(applyFilters());

    addBtn.addEventListener("click", () => {
        const formDiv = document.createElement("div");

        const patientSelect = document.createElement("select");
        clinicApp.patients.forEach(p => {
            const option = document.createElement("option");
            option.value = p.id;
            option.textContent = p.fullName;
            patientSelect.appendChild(option);
        });

        const practitionerInput = document.createElement("input");
        practitionerInput.placeholder = "Practitioner";

        const dateInput = document.createElement("input");
        dateInput.type = "datetime-local";

        const notesInput = document.createElement("input");
        notesInput.placeholder = "Notes";

        const statusSelect = document.createElement("select");
        statusSelect.innerHTML = statusOptions.map(s =>
            `<option value="${s}">${s === "" ? "confirmed" : s.charAt(0).toUpperCase() + s.slice(1)}</option>`).join('');

        const submitBtn = document.createElement("button");
        submitBtn.textContent = "Submit";

        formDiv.appendChild(patientSelect);
        formDiv.appendChild(practitionerInput);
        formDiv.appendChild(dateInput);
        formDiv.appendChild(notesInput);
        formDiv.appendChild(statusSelect);
        formDiv.appendChild(submitBtn);

        appointmentsSection.insertBefore(formDiv, table);

        submitBtn.addEventListener("click", () => {
            const patientId = patientSelect.value;
            const patientObj = clinicApp.patients.find(p => String(p.id) === String(patientId));
            const statusValue = statusSelect.value || "confirmed";
            if (patientObj && practitionerInput.value && dateInput.value) {
                const id = Date.now();
                const appointment = createAppointment(
                    id,
                    patientObj,
                    practitionerInput.value,
                    dateInput.value,
                    notesInput.value
                );
                appointment.status = statusValue;
                clinicApp.saveToLocalStorage();
                renderAppointmentsTable(applyFilters());
                formDiv.remove();
            } else {
                alert("Please fill in all fields!");
            }
        });
    });
}