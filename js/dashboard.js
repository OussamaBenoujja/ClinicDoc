import { clinicApp, createPatient, createAppointment } from "./main.js";

export function dashboard() {
    document.body.innerHTML = "";

    const main = document.createElement("div");
    document.body.appendChild(main);

    const nav = document.createElement("div");
    const patientsBtn = document.createElement("button");
    patientsBtn.textContent = "Patients";
    const appointmentsBtn = document.createElement("button");
    appointmentsBtn.textContent = "Appointments";
    nav.appendChild(patientsBtn);
    nav.appendChild(appointmentsBtn);
    main.appendChild(nav);

    function showPatientsSection() {
        main.innerHTML = "";
        main.appendChild(nav);

        const patientsSection = document.createElement("div");
        const titleRow = document.createElement("div");
        const title = document.createElement("h2");
        title.textContent = "Patient Management";
        titleRow.appendChild(title);

        const addBtn = document.createElement("button");
        addBtn.textContent = "Add Patient";
        titleRow.appendChild(addBtn);

        patientsSection.appendChild(titleRow);

        const searchBar = document.createElement("input");
        searchBar.type = "text";
        searchBar.placeholder = "Search by name or phone...";
        patientsSection.appendChild(searchBar);

        const table = document.createElement("table");
        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");
        const headers = [
            "Full Name",
            "Phone",
            "E-mail",
            "Notes",
            "Date Added",
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

        patientsSection.appendChild(table);

        main.appendChild(patientsSection);

        function renderPatientsTable(patients) {
            tbody.innerHTML = "";
            patients.forEach((patient, idx) => {
                const row = document.createElement("tr");

                const tdName = document.createElement("td");
                tdName.textContent = patient.fullName;
                row.appendChild(tdName);

                const tdPhone = document.createElement("td");
                tdPhone.textContent = patient.phone;
                row.appendChild(tdPhone);

                const tdEmail = document.createElement("td");
                tdEmail.textContent = patient.email;
                row.appendChild(tdEmail);

                const tdNotes = document.createElement("td");
                tdNotes.textContent = patient.notes;
                row.appendChild(tdNotes);

                const tdDate = document.createElement("td");
                tdDate.textContent = patient.createdAt
                    ? patient.createdAt.toLocaleDateString()
                    : "";
                row.appendChild(tdDate);

                const tdActions = document.createElement("td");

                const viewBtn = document.createElement("button");
                viewBtn.textContent = "👁";
                tdActions.appendChild(viewBtn);

                const editBtn = document.createElement("button");
                editBtn.textContent = "✏️";
                editBtn.addEventListener("click", () => {
                    const formDiv = document.createElement("div");

                    const nameInput = document.createElement("input");
                    nameInput.value = patient.fullName;

                    const phoneInput = document.createElement("input");
                    phoneInput.value = patient.phone;

                    const emailInput = document.createElement("input");
                    emailInput.value = patient.email;

                    const birthInput = document.createElement("input");
                    birthInput.type = "date";
                    birthInput.value = patient.birthDay ? new Date(patient.birthDay).toISOString().substring(0,10) : "";

                    const notesInput = document.createElement("input");
                    notesInput.value = patient.notes;

                    const submitBtn = document.createElement("button");
                    submitBtn.textContent = "Save";

                    formDiv.appendChild(nameInput);
                    formDiv.appendChild(phoneInput);
                    formDiv.appendChild(emailInput);
                    formDiv.appendChild(birthInput);
                    formDiv.appendChild(notesInput);
                    formDiv.appendChild(submitBtn);

                    patientsSection.insertBefore(formDiv, table);

                    submitBtn.addEventListener("click", () => {
                        if (nameInput.value && phoneInput.value && emailInput.value && birthInput.value) {
                            patient.edit(
                                patient.id,
                                nameInput.value,
                                phoneInput.value,
                                emailInput.value,
                                notesInput.value
                            );
                            patient.birthDay = new Date(birthInput.value);
                            patient.updatedAt = new Date();
                            clinicApp.saveToLocalStorage();
                            renderPatientsTable(clinicApp.patients);
                            formDiv.remove();
                        } else {
                            alert("Please fill in all fields!");
                        }
                    });
                });
                tdActions.appendChild(editBtn);

                const delBtn = document.createElement("button");
                delBtn.textContent = "🗑";
                delBtn.addEventListener("click", () => {
                    clinicApp.patients.splice(idx, 1);
                    clinicApp.saveToLocalStorage();
                    renderPatientsTable(clinicApp.patients);
                });
                tdActions.appendChild(delBtn);

                row.appendChild(tdActions);
                tbody.appendChild(row);
            });
        }

        renderPatientsTable(clinicApp.patients);

        addBtn.addEventListener("click", () => {
            const formDiv = document.createElement("div");

            const nameInput = document.createElement("input");
            nameInput.placeholder = "Full Name";

            const phoneInput = document.createElement("input");
            phoneInput.placeholder = "Phone";

            const emailInput = document.createElement("input");
            emailInput.placeholder = "E-mail";

            const birthInput = document.createElement("input");
            birthInput.type = "date";
            birthInput.placeholder = "Birthday";

            const notesInput = document.createElement("input");
            notesInput.placeholder = "Notes";

            const submitBtn = document.createElement("button");
            submitBtn.textContent = "Submit";

            formDiv.appendChild(nameInput);
            formDiv.appendChild(phoneInput);
            formDiv.appendChild(emailInput);
            formDiv.appendChild(birthInput);
            formDiv.appendChild(notesInput);
            formDiv.appendChild(submitBtn);

            patientsSection.insertBefore(formDiv, table);

            submitBtn.addEventListener("click", () => {
                if (nameInput.value && phoneInput.value && emailInput.value && birthInput.value) {
                    const id = Date.now();
                    createPatient(
                        id,
                        nameInput.value,
                        phoneInput.value,
                        birthInput.value,
                        emailInput.value,
                        notesInput.value
                    );
                    clinicApp.saveToLocalStorage();
                    renderPatientsTable(clinicApp.patients);
                    formDiv.remove();
                } else {
                    alert("Please fill in all fields!");
                }
            });
        });
    }

    function showAppointmentsSection() {
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

        const table = document.createElement("table");
        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");
        const headers = [
            "Patient",
            "Practitioner",
            "Date",
            "Notes",
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
                    renderAppointmentsTable(clinicApp.appointments);
                });
                tdActions.appendChild(delBtn);

                row.appendChild(tdActions);
                tbody.appendChild(row);
            });
        }

        renderAppointmentsTable(clinicApp.appointments);

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

            const submitBtn = document.createElement("button");
            submitBtn.textContent = "Submit";

            formDiv.appendChild(patientSelect);
            formDiv.appendChild(practitionerInput);
            formDiv.appendChild(dateInput);
            formDiv.appendChild(notesInput);
            formDiv.appendChild(submitBtn);

            appointmentsSection.insertBefore(formDiv, table);

            submitBtn.addEventListener("click", () => {
                const patientId = patientSelect.value;
                const patientObj = clinicApp.patients.find(p => String(p.id) === String(patientId));
                if (patientObj && practitionerInput.value && dateInput.value) {
                    const id = Date.now();
                    createAppointment(
                        id,
                        patientObj,
                        practitionerInput.value,
                        dateInput.value,
                        notesInput.value
                    );
                    clinicApp.saveToLocalStorage();
                    renderAppointmentsTable(clinicApp.appointments);
                    formDiv.remove();
                } else {
                    alert("Please fill in all fields!");
                }
            });
        });
    }

    patientsBtn.addEventListener("click", showPatientsSection);
    appointmentsBtn.addEventListener("click", showAppointmentsSection);

    showPatientsSection();
}