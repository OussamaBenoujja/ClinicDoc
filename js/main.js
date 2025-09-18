let patients = [];
let appointments = [];
let receipts = [];

let clinicApp = {
   patients: patients,
   appointments: appointments,
   receipts: receipts,
   password: null,
};

function createPassword(password) {
    const pwObj = {
        password,
        edit(newPassword) {
            this.password = newPassword;
        }
    };
    clinicApp.password = pwObj; 
    return pwObj; 

function createPatient(id, fullName, phone, date, email, notes = "") {
  const patient = {
    id,
    fullName,
    phone,
    email,
    notes,
    birthDay: new Date(date),
    createdAt: new Date(),
    updatedAt: new Date(),
    edit(id, fullName, phone, email, notes) {
        this.id = id;
        this.fullName = fullName;
        this.phone = phone;
        this.email = email;
        this.notes = notes;
        this.updatedAt = new Date();
    },
    delete() {
        const index = patients.indexOf(this);
        if (index > -1) patients.splice(index, 1);
    }
  };
  patients.push(patient);
  return patient;
}

function createAppointment(id, patient, practitioner, date, notes = "") {
  const appointment = {
    id,
    patient,
    practitioner,
    date: new Date(date),
    notes,
    createdAt: new Date(),
    edit(id, patient, practitioner, date, notes) {
      this.id = id;
      this.patient = patient;
      this.practitioner = practitioner;
      this.date = new Date(date);
      this.notes = notes;
    },
    delete() {
      const index = appointments.indexOf(this);
      if (index > -1) appointments.splice(index, 1);
    }
  };
  appointments.push(appointment);
  return appointment;
}

function createReceipt(id, appointment, amount, status = "pending", notes = "") {
  const receipt = {
    id,
    appointment,
    amount,
    status,
    notes,
    createdAt: new Date(),
    edit(id, appointment, amount, status, notes) {
      this.id = id;
      this.appointment = appointment;
      this.amount = amount;
      this.status = status;
      this.notes = notes;
    },
    delete() {
      const index = receipts.indexOf(this);
      if (index > -1) receipts.splice(index, 1);
    }
  };
  receipts.push(receipt);
  return receipt;
}