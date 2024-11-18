export const MATERIAL_COLOR = {
    NONE: undefined,
    PRIMARY: 'primary',
    ACCENT: 'accent',
    WARN: 'warn',
} as const; // Typisierung -> enum auch möglich!

export type MaterialColor = (typeof MATERIAL_COLOR)[keyof typeof MATERIAL_COLOR];
