import { Observable } from 'rxjs';

export interface MenuBarItem {
  name: string;
  routePath: string;
  visible?: Observable<boolean>;
  highlighted?: boolean;
  icon?: string;
}
