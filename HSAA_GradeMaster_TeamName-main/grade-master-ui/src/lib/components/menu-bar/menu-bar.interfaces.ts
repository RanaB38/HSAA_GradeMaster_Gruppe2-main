import { Observable } from 'rxjs';

/**
 * Schnittstelle für einen Menüeintrag in der Navigationsleiste.
 */
export interface MenuBarItem {

  /** Der Name des Menüeintrags (wird im UI angezeigt). */
  name: string;

  /** Der Routenpfad, zu dem der Menüeintrag navigiert. */
  routePath: string;

  /**
   * Eine optionale Observable-Variable, um die Sichtbarkeit des Menüeintrags dynamisch zu steuern.
   * Wenn `true`, wird der Eintrag angezeigt, andernfalls ausgeblendet.
   */
  visible?: Observable<boolean>;

  /** Falls `true`, wird der Menüeintrag optisch hervorgehoben. */
  highlighted?: boolean;

  /** Ein optionales Symbol für den Menüeintrag (z. B. Material Icon Name). */
  icon?: string;
}
