import { clinicApp, createPatient, createAppointment, createReceipt } from "./main.js";

export function dashboard() {
    document.body.innerHTML = "";

    const main = document.createElement("div");
    document.body.appendChild(main);

    const nav = document.createElement("div");
    const patientsBtn = document.createElement("button");
    patientsBtn.textContent = "Patients";
    const appointmentsBtn = document.createElement("button");
    appointmentsBtn.textContent = "Appointments";
    const receiptsBtn = document.createElement("button");
    receiptsBtn.textContent = "Expenses & Recettes";
    nav.appendChild(patientsBtn);
    nav.appendChild(appointmentsBtn);
    nav.appendChild(receiptsBtn);
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

    function showReceiptsSection() {
        main.innerHTML = "";
        main.appendChild(nav);

        const receiptsSection = document.createElement("div");
        const titleRow = document.createElement("div");
        const title = document.createElement("h2");
        title.textContent = "Income & Expenses";
        titleRow.appendChild(title);

        const addIncomeBtn = document.createElement("button");
        addIncomeBtn.textContent = "New Income";
        titleRow.appendChild(addIncomeBtn);

        const addExpenseBtn = document.createElement("button");
        addExpenseBtn.textContent = "New Expense";
        titleRow.appendChild(addExpenseBtn);

        receiptsSection.appendChild(titleRow);

        function sumReceipts(type) {
            let sum = 0;
            for (let i = 0; i < clinicApp.receipts.length; i++) {
                const r = clinicApp.receipts[i];
                if (r.type === type) {
                    sum += Number(r.amount);
                }
            }
            return sum;
        }

        const monthlyIncome = sumReceipts("income");
        const totalExpenses = sumReceipts("expense");
        const margin = monthlyIncome - totalExpenses;
        const transactionCount = clinicApp.receipts.length;

        const statsRow = document.createElement("div");
        statsRow.innerHTML =
            `<span>Monthly Income: €${monthlyIncome}</span> ` +
            `<span>Total Expenses: €${totalExpenses}</span> ` +
            `<span>Margin: €${margin}</span> ` +
            `<span>Transactions: ${transactionCount}</span>`;
        receiptsSection.appendChild(statsRow);

        const budgetRow = document.createElement("div");
        const budgetGoal = 10000;
        const actual = monthlyIncome - totalExpenses;
        budgetRow.innerHTML =
            `Actual: €${actual} | Goal: €${budgetGoal} | Remaining: €${budgetGoal - actual}`;
        receiptsSection.appendChild(budgetRow);

        const searchBar = document.createElement("input");
        searchBar.placeholder = "Search by label or notes...";
        receiptsSection.appendChild(searchBar);

        const table = document.createElement("table");
        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");
        const headers = [
            "Date",
            "Type",
            "Category",
            "Label",
            "Payment Method",
            "Amount",
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

        receiptsSection.appendChild(table);

        main.appendChild(receiptsSection);

        function renderReceiptsTable(receipts) {
            tbody.innerHTML = "";
            receipts.forEach((receipt, idx) => {
                const row = document.createElement("tr");

                const tdDate = document.createElement("td");
                tdDate.textContent = receipt.createdAt
                    ? new Date(receipt.createdAt).toISOString().substring(0,10)
                    : "";
                row.appendChild(tdDate);

                const tdType = document.createElement("td");
                tdType.textContent = receipt.type === "income" ? "INCOME" : "EXPENSE";
                row.appendChild(tdType);

                const tdCategory = document.createElement("td");
                tdCategory.textContent = receipt.category || "";
                row.appendChild(tdCategory);

                const tdLabel = document.createElement("td");
                tdLabel.textContent = receipt.notes || "";
                row.appendChild(tdLabel);

                const tdMethod = document.createElement("td");
                tdMethod.textContent = receipt.method || "";
                row.appendChild(tdMethod);

                const tdAmount = document.createElement("td");
                tdAmount.textContent = "€" + receipt.amount;
                row.appendChild(tdAmount);

                const tdActions = document.createElement("td");

                const editBtn = document.createElement("button");
                editBtn.textContent = "Edit";
                editBtn.addEventListener("click", () => {
                    const formDiv = document.createElement("div");

                    const typeSelect = document.createElement("select");
                    ["income", "expense"].forEach(t => {
                        const opt = document.createElement("option");
                        opt.value = t;
                        opt.textContent = t.charAt(0).toUpperCase() + t.slice(1);
                        if (receipt.type === t) opt.selected = true;
                        typeSelect.appendChild(opt);
                    });

                    const amountInput = document.createElement("input");
                    amountInput.type = "number";
                    amountInput.value = receipt.amount;

                    const methodInput = document.createElement("input");
                    methodInput.placeholder = "Payment Method";
                    methodInput.value = receipt.method || "";

                    const categoryInput = document.createElement("input");
                    categoryInput.placeholder = "Category";
                    categoryInput.value = receipt.category || "";

                    const labelInput = document.createElement("input");
                    labelInput.placeholder = "Label/Notes";
                    labelInput.value = receipt.notes || "";

                    const dateInput = document.createElement("input");
                    dateInput.type = "date";
                    dateInput.value = receipt.createdAt
                        ? new Date(receipt.createdAt).toISOString().substring(0,10)
                        : "";

                    const submitBtn = document.createElement("button");
                    submitBtn.textContent = "Save";

                    formDiv.appendChild(typeSelect);
                    formDiv.appendChild(amountInput);
                    formDiv.appendChild(methodInput);
                    formDiv.appendChild(categoryInput);
                    formDiv.appendChild(labelInput);
                    formDiv.appendChild(dateInput);
                    formDiv.appendChild(submitBtn);

                    receiptsSection.insertBefore(formDiv, table);

                    submitBtn.addEventListener("click", () => {
                        if (amountInput.value && categoryInput.value && labelInput.value && dateInput.value) {
                            receipt.edit(
                                receipt.id,
                                receipt.appointment,
                                amountInput.value,
                                typeSelect.value,
                                receipt.status,
                                labelInput.value,
                                methodInput.value,
                                categoryInput.value,
                                dateInput.value
                            );
                            clinicApp.saveToLocalStorage();
                            renderReceiptsTable(clinicApp.receipts);
                            formDiv.remove();
                        } else {
                            alert("Please fill in all fields!");
                        }
                    });
                });
                tdActions.appendChild(editBtn);

                const delBtn = document.createElement("button");
                delBtn.textContent = "Delete";
                delBtn.addEventListener("click", () => {
                    clinicApp.receipts.splice(idx, 1);
                    clinicApp.saveToLocalStorage();
                    renderReceiptsTable(clinicApp.receipts);
                });
                tdActions.appendChild(delBtn);

                row.appendChild(tdActions);
                tbody.appendChild(row);
            });
        }

        renderReceiptsTable(clinicApp.receipts);

        addIncomeBtn.addEventListener("click", () => {
            showReceiptForm("income");
        });

        addExpenseBtn.addEventListener("click", () => {
            showReceiptForm("expense");
        });

        function showReceiptForm(type) {
            const formDiv = document.createElement("div");

            const amountInput = document.createElement("input");
            amountInput.type = "number";
            amountInput.placeholder = "Amount";

            const methodInput = document.createElement("input");
            methodInput.placeholder = "Payment Method";

            const categoryInput = document.createElement("input");
            categoryInput.placeholder = "Category";

            const labelInput = document.createElement("input");
            labelInput.placeholder = "Label/Notes";

            const dateInput = document.createElement("input");
            dateInput.type = "date";
            dateInput.value = new Date().toISOString().substring(0,10);

            const submitBtn = document.createElement("button");
            submitBtn.textContent = "Submit";

            formDiv.appendChild(amountInput);
            formDiv.appendChild(methodInput);
            formDiv.appendChild(categoryInput);
            formDiv.appendChild(labelInput);
            formDiv.appendChild(dateInput);
            formDiv.appendChild(submitBtn);

            receiptsSection.insertBefore(formDiv, table);

            submitBtn.addEventListener("click", () => {
                if (amountInput.value && categoryInput.value && labelInput.value && dateInput.value) {
                    const id = Date.now();
                    createReceipt(
                        id,
                        null,
                        amountInput.value,
                        type,
                        "confirmed",
                        labelInput.value,
                        methodInput.value,
                        categoryInput.value,
                        dateInput.value
                    );
                    clinicApp.saveToLocalStorage();
                    renderReceiptsTable(clinicApp.receipts);
                    formDiv.remove();
                } else {
                    alert("Please fill in all fields!");
                }
            });
        }
    }

    patientsBtn.addEventListener("click", showPatientsSection);
    appointmentsBtn.addEventListener("click", showAppointmentsSection);
    receiptsBtn.addEventListener("click", showReceiptsSection);

    showPatientsSection();
}