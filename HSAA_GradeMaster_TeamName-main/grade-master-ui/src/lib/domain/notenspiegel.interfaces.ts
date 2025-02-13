/**
 * Repräsentiert eine Notenskala mit Prozentbereichen und zugehörigen Noten.
 */
export interface Notenspiegel {
  /** Eindeutige Identifikationsnummer der Notenskala. */
  id: number;

  /** Minimaler Prozentsatz für diese Note. */
  minPercentage: number;

  /** Maximaler Prozentsatz für diese Note. */
  maxPercentage: number;

  /** Die zugewiesene Note für den angegebenen Prozentbereich. */
  grade: string;

  /** Beschreibung oder zusätzliche Informationen zur Note. */
  description: string;
}
