export let patients = [];
export let appointments = [];
export let receipts = [];
export let isLoggedIn = false;

export function setIsLoggedIn(val){
    return isLoggedIn = val;
};


const DATA_KEY = "clinicApp:data";   
const PW_KEY   = "clinicApp:pw";    
const LGKEY = "clinicApp";      



function hashPW(password_){
  let hash
  for(let i = 0;i<password_.legth;i++){
    hash += password_.charCodeAt(i);
  }

  return hash % 100000;
}




function encrypt(text, shift) {
  let out = "";
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    out += String.fromCharCode(code + shift);
  }
  return out;
}

function decrypt(text, shift) {
  let out = "";
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    out += String.fromCharCode(code - shift);
  }
  return out;
}


function deriveShiftFromPassword(pw) {
  if (!pw) return 0; 
  let sum = 0;
  for (let i = 0; i < pw.length; i++) sum = (sum + pw.charCodeAt(i)) % 65535;
  return sum; 
}

export let clinicApp = {
  patients: [],
  appointments: [],
  receipts: [],
  pw: null,

  saveToLocalStorage() {
    
    localStorage.setItem(PW_KEY, JSON.stringify(this.pw));

    const payload = {
      patients: this.patients,
      appointments: this.appointments,
      receipts: this.receipts
    };

    const shift = deriveShiftFromPassword(this.pw?.password);
    const plain = JSON.stringify(payload);
    const cipher = encrypt(plain, shift);
    localStorage.setItem(DATA_KEY, cipher);

   
    localStorage.removeItem(LGKEY);
  },

  loadFromLocalStorage() {
    
    const pwRaw = localStorage.getItem(PW_KEY);
    if (pwRaw) {
    
        const parsed = JSON.parse(pwRaw);
        if (parsed && typeof parsed === "object") {
          this.pw = {
            ...parsed,
            edit: function(newPassword) {
              this.password = newPassword;
            }
          };
        }
      
    }

    let data = null;

    
    const cipher = localStorage.getItem(DATA_KEY);
    if (cipher && this.pw?.password) {
      try {
        const shift = deriveShiftFromPassword(this.pw.password);
        const plain = decrypt(cipher, shift);
        data = JSON.parse(plain);
      } catch (_) {
        data = null;
      }
    }

    
    if (!data) {
      const legacy = localStorage.getItem(LGKEY);
      if (legacy) {
        try {
          const legacyObj = JSON.parse(legacy);
          
          if (!this.pw && legacyObj.pw) {
            this.pw = {
              ...legacyObj.pw,
              edit: function(newPassword) {
                this.password = newPassword;
              }
            };
          }
          data = {
            patients: legacyObj.patients || [],
            appointments: legacyObj.appointments || [],
            receipts: legacyObj.receipts || []
          };
        } catch (_) {
          data = null;
        }
      }
    }

    if (!data) return;

    this.patients = (data.patients || []).map(p => ({
      ...p,
      birthDay: p.birthDay ? new Date(p.birthDay) : null,
      createdAt: p.createdAt ? new Date(p.createdAt) : null,
      updatedAt: p.updatedAt ? new Date(p.updatedAt) : null,
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
      date: a.date ? new Date(a.date) : null,
      createdAt: a.createdAt ? new Date(a.createdAt) : null,
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
      createdAt: r.createdAt ? new Date(r.createdAt) : null,
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
  }
};

export function createPassword(password) {
  const pwObj = {
    password,
    edit(newPassword) {
      this.password = newPassword;
    }
  };
  clinicApp.pw = pwObj;
  
  localStorage.setItem(PW_KEY, JSON.stringify(pwObj));
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
    type,
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