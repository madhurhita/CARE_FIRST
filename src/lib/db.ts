import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "appointments.db");

let db: Database.Database;

function getDb(): Database.Database {
  if (!db) {
    db = new Database(dbPath);
    db.pragma("journal_mode = WAL");
    db.exec(`
      CREATE TABLE IF NOT EXISTS appointments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patient_name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT DEFAULT '',
        department TEXT NOT NULL,
        appointment_date TEXT NOT NULL,
        appointment_time TEXT NOT NULL,
        created_at TEXT DEFAULT (datetime('now')),
        UNIQUE(department, appointment_date, appointment_time)
      )
    `);
  }
  return db;
}

export function getBookedSlots(department: string, date: string): string[] {
  const database = getDb();
  const rows = database
    .prepare(
      "SELECT appointment_time FROM appointments WHERE department = ? AND appointment_date = ?"
    )
    .all(department, date) as { appointment_time: string }[];
  return rows.map((r) => r.appointment_time);
}

export function bookAppointment(data: {
  patientName: string;
  email: string;
  phone: string;
  department: string;
  appointmentDate: string;
  appointmentTime: string;
}): { success: boolean; error?: string } {
  const database = getDb();
  try {
    database
      .prepare(
        `INSERT INTO appointments (patient_name, email, phone, department, appointment_date, appointment_time)
         VALUES (?, ?, ?, ?, ?, ?)`
      )
      .run(
        data.patientName,
        data.email,
        data.phone,
        data.department,
        data.appointmentDate,
        data.appointmentTime
      );
    return { success: true };
  } catch (err: unknown) {
    if (
      err instanceof Error &&
      err.message.includes("UNIQUE constraint failed")
    ) {
      return {
        success: false,
        error:
          "This appointment slot is no longer available. Please choose another slot.",
      };
    }
    throw err;
  }
}
