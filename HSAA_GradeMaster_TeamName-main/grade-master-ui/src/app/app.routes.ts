import { Routes } from '@angular/router';
import { CourseDialogHandlerComponent } from './views/course/course-dialog/course-dialog-handler/course-dialog-handler.component';
import { LoginComponent } from './views/login/login.component'; // Login-Komponente importieren
import { AuthGuard } from './views/login/auth.guard'; // AuthGuard importieren

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login', // Standardroute zur Login-Seite umleiten
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent, // Login-Komponente
  },
  {
    path: 'dialog',
    component: CourseDialogHandlerComponent,
    outlet: 'dialog',
  },
  {
    path: 'courses',
    loadComponent: () =>
      import('./views/course/course.component').then((mod) => mod.CourseComponent),
    canActivate: [AuthGuard], // Nur für authentifizierte Benutzer zugänglich
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./views/course/course-overview/course-overview.component').then(
            (mod) => mod.CourseOverviewComponent
          ),
      },
      {
        path: ':id/details', // Kurs-Detail-Seite
        loadComponent: () =>
          import('./views/course/course-detail/course-detail.component').then(
            (mod) => mod.CourseDetailComponent
          ),
      },
      {
        path: ':courseId/groups/:groupId/details', // Gruppen-Detail-Seite
        loadComponent: () =>
          import('./views/course/group-detail/group-detail.component').then((mod) => {
            console.log('GroupDetailComponent wird geladen...');
            return mod.GroupDetailComponent;
          }),
      },
    ],
  },
  {
    path: 'students',
    loadComponent: () =>
      import('./views/student/student.component').then((mod) => mod.StudentComponent),
    canActivate: [AuthGuard], // Nur für authentifizierte Benutzer zugänglich
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'list',
      },
      {
        path: 'list',
        loadComponent: () =>
          import('./views/student/student-list/student-list.component').then(
            (mod) => mod.StudentListComponent
          ),
      },
      {
        path: ':id/details',
        loadComponent: () =>
          import('./views/student/student-detail/student-detail.component').then(
            (mod) => mod.StudentDetailComponent
          ),
      },
    ],
  },
  {
    path: 'impressum',
    loadComponent: () =>
      import('./views/impressum/impressum.component').then((mod) => mod.ImpressumComponent),
    children: [
      {
        path: 'error',
        loadComponent: () =>
          import('../lib/components/four-zero-four/four-zero-four.component').then(
            (mod) => mod.FourZeroFourComponent
          ),
      },
    ],
  },
  {
    path: '**',
    loadComponent: () =>
      import('../lib/components/four-zero-four/four-zero-four.component').then(
        (mod) => mod.FourZeroFourComponent
      ),
  },
];
