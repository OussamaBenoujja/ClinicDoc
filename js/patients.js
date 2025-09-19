import { clinicApp, createPatient, createAppointment, createReceipt } from "./main.js";


    
export function showPatientsSection(main, nav) {
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
                viewBtn.textContent = "view";
                tdActions.appendChild(viewBtn);

                const editBtn = document.createElement("button");
                editBtn.textContent = "edit";
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
                delBtn.textContent = "delete";
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
