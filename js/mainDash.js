
import { clinicApp, createPatient, createAppointment, createReceipt } from "./main.js";

export function showMainDashboard(main, nav) {
        main.innerHTML = "";
        main.appendChild(nav);

        const dashboardSection = document.createElement("div");
        const statsBox = document.createElement("div");

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
        const patientCount = clinicApp.patients.length;
        let consultations = clinicApp.appointments.length;

        const incomeBox = document.createElement("div");
        incomeBox.innerHTML = `<span>Monthly Income</span><br><span>€${monthlyIncome}</span>`;

        const expensesBox = document.createElement("div");
        expensesBox.innerHTML = `<span>Total Expenses</span><br><span>€${totalExpenses}</span>`;

        const marginBox = document.createElement("div");
        marginBox.innerHTML = `<span>Margin</span><br><span>€${margin}</span>`;

        const patientsBox = document.createElement("div");
        patientsBox.innerHTML = `<span>Total Patients</span><br><span>${patientCount}</span>`;

        const consultBox = document.createElement("div");
        consultBox.innerHTML = `<span>Consultations</span><br><span>${consultations}</span>`;

        statsBox.appendChild(incomeBox);
        statsBox.appendChild(expensesBox);
        statsBox.appendChild(marginBox);
        statsBox.appendChild(patientsBox);
        statsBox.appendChild(consultBox);

        dashboardSection.appendChild(statsBox);

        const chartBox = document.createElement("div");
        const canvas = document.createElement("canvas");
        canvas.width = 400;
        canvas.height = 250;
        chartBox.appendChild(canvas);
        dashboardSection.appendChild(chartBox);

        main.appendChild(dashboardSection);

        function getLast6MonthsLabels() {
            const arr = [];
            const now = new Date();
            for (let i = 5; i >= 0; i--) {
                const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
                arr.push(d.toLocaleString("default", { month: "short" }));
            }
            return arr;
        }
        function getMonthlyTotals(type) {
            const now = new Date();
            const totals = [0,0,0,0,0,0];
            for (let i = 0; i < clinicApp.receipts.length; i++) {
                const r = clinicApp.receipts[i];
                if (r.type === type) {
                    const d = new Date(r.createdAt);
                    const diff = (now.getFullYear() - d.getFullYear()) * 12 + now.getMonth() - d.getMonth();
                    if (diff >= 0 && diff < 6) {
                        totals[5-diff] += Number(r.amount);
                    }
                }
            }
            return totals;
        }

        const chartData = {
            labels: getLast6MonthsLabels(),
            datasets: [
                {
                    label: "Income",
                    borderColor: "red",
                    backgroundColor: "rgba(255,0,0,0.1)",
                    data: getMonthlyTotals("income")
                },
                {
                    label: "Expenses",
                    borderColor: "green",
                    backgroundColor: "rgba(0,255,0,0.1)",
                    data: getMonthlyTotals("expense")
                }
            ]
        };

        // Use Chart global from CDN
        new window.Chart(canvas, {
            type: "line",
            data: chartData,
            options: {
                responsive: false,
                plugins: {
                    legend: {
                        display: true
                    }
                }
            }
        });
    }