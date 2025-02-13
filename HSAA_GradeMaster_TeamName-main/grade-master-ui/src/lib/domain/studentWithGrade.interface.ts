/**
 * Repräsentiert einen Studenten mit zugehöriger Note.
 */
export interface StudentWithGrade {
  /** Eindeutige Identifikationsnummer des Studenten. */
  id: number;

  /** Vollständiger Name des Studenten. */
  name: string;

  /** E-Mail-Adresse des Studenten. */
  email: string;

  /** Note des Studenten. */
  grade: string;
}
