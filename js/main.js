export let patients = [];
export let appointments = [];
export let receipts = [];
export let isLoggedIn = false;

export function setIsLoggedIn(val){
    return isLoggedIn = val;
};

const DATA_KEY = "clinicApp:data";
const PW_KEY   = "clinicApp:pw";
const LEGACY_KEY = "clinicApp";

const MAX_FAILS = 5;
const LOCKOUT_MS = 5 * 60 * 1000;

function hashPW(password_) {
  let hash = 0;
  let mod = 1;
  for (let i = 0, j = 1; i < password_.length; i++, j++) {
    hash += password_.charCodeAt(i);
    mod %= j;
    hash += mod;
  }
  return hash;
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

function savePwMeta(pwObj) {
  localStorage.setItem(PW_KEY, JSON.stringify(pwObj));
}

function loadPwMeta() {
  const raw = localStorage.getItem(PW_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

export let clinicApp = {
  patients: [],
  appointments: [],
  receipts: [],
  pw: null,
  sessionShift: null,

  saveToLocalStorage() {
    savePwMeta(this.pw);
    if (this.sessionShift == null) return;
    const payload = {
      patients: this.patients,
      appointments: this.appointments,
      receipts: this.receipts
    };
    const cipher = encrypt(JSON.stringify(payload), this.sessionShift);
    localStorage.setItem(DATA_KEY, cipher);
    localStorage.removeItem(LEGACY_KEY);
  },

  loadFromLocalStorage() {
    this.pw = loadPwMeta();
    this.patients = [];
    this.appointments = [];
    this.receipts = [];
    const legacy = localStorage.getItem(LEGACY_KEY);
    if (legacy && !localStorage.getItem(DATA_KEY)) {
      try {
        const legacyObj = JSON.parse(legacy);
        if (!this.pw && legacyObj.pw) {
          this.pw = {
            hash: hashPW(legacyObj.pw.password || ""),
            failedAttempts: 0,
            lockedUntil: 0
          };
          savePwMeta(this.pw);
        }
      } catch {}
    }
  },

  unlockWithPassword(password) {
    const v = this.verifyPassword(password);
    if (!v.ok) return v;
    this.sessionShift = deriveShiftFromPassword(password);
    const cipher = localStorage.getItem(DATA_KEY);
    if (cipher) {
      try {
        const plain = decrypt(cipher, this.sessionShift);
        const data = JSON.parse(plain);
        this.hydrateData(data);
        return { ok: true };
      } catch {
        this.patients = [];
        this.appointments = [];
        this.receipts = [];
        return { ok: false, reason: "decrypt-failed" };
      }
    } else {
      const legacy = localStorage.getItem(LEGACY_KEY);
      if (legacy) {
        try {
          const legacyObj = JSON.parse(legacy);
          this.hydrateData({
            patients: legacyObj.patients || [],
            appointments: legacyObj.appointments || [],
            receipts: legacyObj.receipts || []
          });
          this.saveToLocalStorage();
          localStorage.removeItem(LEGACY_KEY);
        } catch {
          this.patients = [];
          this.appointments = [];
          this.receipts = [];
        }
      }
      return { ok: true };
    }
  },

  hydrateData(data) {
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
  },

  verifyPassword(password) {
    if (!this.pw || typeof this.pw.hash === "undefined") {
      return { ok: false, reason: "no-password" };
    }
    const now = Date.now();
    if (this.pw.lockedUntil && now < this.pw.lockedUntil) {
      return { ok: false, reason: "locked", lockedUntil: this.pw.lockedUntil };
    }
    const candidate = hashPW(password);
    if (candidate === this.pw.hash) {
      this.pw.failedAttempts = 0;
      this.pw.lockedUntil = 0;
      savePwMeta(this.pw);
      return { ok: true };
    } else {
      this.pw.failedAttempts = (this.pw.failedAttempts || 0) + 1;
      if (this.pw.failedAttempts >= MAX_FAILS) {
        this.pw.lockedUntil = now + LOCKOUT_MS;
        this.pw.failedAttempts = 0;
      }
      savePwMeta(this.pw);
      return { ok: false, reason: "mismatch", remaining: Math.max(0, MAX_FAILS - (this.pw.failedAttempts || 0)) };
    }
  }
};

export function createPassword(password) {
  const pwObj = {
    hash: hashPW(password),
    failedAttempts: 0,
    lockedUntil: 0
  };
  clinicApp.pw = pwObj;
  localStorage.setItem(PW_KEY, JSON.stringify(pwObj));
  clinicApp.sessionShift = deriveShiftFromPassword(password);
  clinicApp.saveToLocalStorage();
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