import { clinicApp, createPatient, createAppointment, createReceipt } from "./main.js";


export function showReceiptsSection(main, nav) {
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