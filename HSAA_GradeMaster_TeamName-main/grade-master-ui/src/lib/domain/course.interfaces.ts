import { Student } from "./student.interfaces";

/**
 * Schnittstelle fÃ¼r einen Kurs.
 */
export interface Course {
  /** Eindeutige ID des Kurses */
  id: number;

  /** Name des Kurses */
  name: string;

  /** Beschreibung des Kurses */
  description: string;

  /** Liste der eingeschriebenen Studierenden (optional auskommentiert) */
  // students: Student[];
}
