/**
 * Enthält vordefinierte Material-Design-Farben.
 * Diese Farben werden für das Styling in Angular Material genutzt.
 */
export const MATERIAL_COLOR = {
  /** Keine Farbe definiert. */
  NONE: undefined,

  /** Primärfarbe gemäß Material-Design-Thema. */
  PRIMARY: 'primary',

  /** Akzentfarbe gemäß Material-Design-Thema. */
  ACCENT: 'accent',

  /** Warnfarbe für kritische Inhalte. */
  WARN: 'warn',

  /** Blaue Farbe, aktuell als Akzentfarbe definiert. */
  BLUE: 'accent',

  /** Grüne Farbe, aktuell als Akzentfarbe definiert. */
  GREEN: 'accent',
} as const;

/**
 * Typ für zulässige Material-Design-Farben.
 */
export type MaterialColor = (typeof MATERIAL_COLOR)[keyof typeof MATERIAL_COLOR];
