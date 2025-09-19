export let patients = [];
export let appointments = [];
export let receipts = [];
export let isLoggedIn = false;

export let clinicApp = {
  patients: [],
  appointments: [],
  receipts: [],
  pw: null,

  //this one is used to save ur stuff to local storage the name says it bruh
  saveToLocalStorage() {
    localStorage.setItem(
      "clinicApp",
      JSON.stringify({
        patients: this.patients,
        appointments: this.appointments,
        receipts: this.receipts,
        pw: this.pw
      })
    );
  },

  //and this one is for loading (dont forget to fix the date issues)
  loadFromLocalStorage() {
    const data = JSON.parse(localStorage.getItem("clinicApp"));
    if (!data) return;

    this.patients = (data.patients || []).map(p => ({
      ...p,
      birthDay: new Date(p.birthDay),
      createdAt: new Date(p.createdAt),
      updatedAt: new Date(p.updatedAt),
      edit: function(id, fullName, phone, email, notes) {
        this.id = id;
        this.fullName = fullName;
        this.phone = phone;
        this.email = email;
        this.notes = notes;
        this.updatedAt = new Date();
      },
      delete: function() {
        const index = clinicApp.patients.indexOf(this);
        if (index > -1) clinicApp.patients.splice(index, 1);
      }
    }));

    this.appointments = (data.appointments || []).map(a => ({
      ...a,
      date: new Date(a.date),
      createdAt: new Date(a.createdAt),
      edit: function(id, patient, practitioner, date, notes) {
        this.id = id;
        this.patient = patient;
        this.practitioner = practitioner;
        this.date = new Date(date);
        this.notes = notes;
      },
      delete: function() {
        const index = clinicApp.appointments.indexOf(this);
        if (index > -1) clinicApp.appointments.splice(index, 1);
      }
    }));

    this.receipts = (data.receipts || []).map(r => ({
      ...r,
      createdAt: new Date(r.createdAt),
      edit: function(id, appointment, amount, status, notes) {
        this.id = id;
        this.appointment = appointment;
        this.amount = amount;
        this.status = status;
        this.notes = notes;
      },
      delete: function() {
        const index = clinicApp.receipts.indexOf(this);
        if (index > -1) clinicApp.receipts.splice(index, 1);
      }
    }));

    if (data.pw) {
      this.pw = {
        ...data.pw,
        edit: function(newPassword) {
          this.password = newPassword;
        }
      };
    } else {
      this.pw = null;
    }
  }
};

export function saveToLocalStorage(){
    localStorage.setItem("clinicApp", JSON.stringify(clinicApp));
}

export function createPassword(password) {
    const pwObj = {
        password,
        edit(newPassword) {
            this.password = newPassword;
        }
    };
    clinicApp.pw = pwObj; 
    return pwObj; 
}

export function createPatient(id, fullName, phone, date, email, notes = "") {
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
        const index = clinicApp.patients.indexOf(this);
        if (index > -1) clinicApp.patients.splice(index, 1);
    }
  };
  clinicApp.patients.push(patient);
  return patient;
}

export function createAppointment(id, patient, practitioner, date, notes = "") {
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
      const index = clinicApp.appointments.indexOf(this);
      if (index > -1) clinicApp.appointments.splice(index, 1);
    }
  };
  clinicApp.appointments.push(appointment);
  return appointment;
}

export function createReceipt(id, appointment, amount, type, status = "pending", notes = "", method = "", category = "", date = new Date()) {
  const receipt = {
    id,
    appointment,
    amount,
    type, //income or expense
    status,
    notes,
    method, 
    category, 
    createdAt: new Date(date),
    edit(id, appointment, amount, type, status, notes, method, category, date) {
      this.id = id;
      this.appointment = appointment;
      this.amount = amount;
      this.type = type;
      this.status = status;
      this.notes = notes;
      this.method = method;
      this.category = category;
      this.createdAt = new Date(date);
    },
    delete() {
      const index = clinicApp.receipts.indexOf(this);
      if (index > -1) clinicApp.receipts.splice(index, 1);
    }
  };
  clinicApp.receipts.push(receipt);
  return receipt;
}