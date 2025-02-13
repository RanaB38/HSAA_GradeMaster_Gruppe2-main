/**
 * Repräsentiert einen Studenten mit ID, Name und E-Mail-Adresse.
 */
export interface Student {
  /** Eindeutige Identifikationsnummer des Studenten. */
  id: number;

  /** Vollständiger Name des Studenten. */
  name: string;

  /** E-Mail-Adresse des Studenten. */
  email: string;
}
