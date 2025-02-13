/**
 * Repräsentiert eine Karte mit einem Titel, Untertitel, Inhalt und einem Bild.
 */
export interface Card {
  /** Die eindeutige ID der Karte. */
  id: number;

  /** Der Titel der Karte. */
  title: string;

  /** Der Untertitel der Karte. */
  subtitle: string;

  /** Der Inhalt der Karte. */
  content: string;

  /** Die URL des Bildes, das mit der Karte verknüpft ist. */
  imageUrl: string;
}
