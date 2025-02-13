import { Routes } from '@angular/router';
import { CourseDialogHandlerComponent } from './views/course/course-dialog/course-dialog-handler/course-dialog-handler.component';
import { LoginComponent } from './views/login/login.component';
import { AuthGuard } from './views/login/auth.guard';
import { HomeComponent } from './views/home/home.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dialog', component: CourseDialogHandlerComponent, outlet: 'dialog' },
  {
    path: 'courses',
    loadComponent: () => import('./views/course/course.component').then(m => m.CourseComponent),
    canActivate: [AuthGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'overview' },
      { path: 'overview', loadComponent: () => import('./views/course/course-overview/course-overview.component').then(m => m.CourseOverviewComponent) },
      { path: ':id/details', loadComponent: () => import('./views/course/course-detail/course-detail.component').then(m => m.CourseDetailComponent) },
      { path: ':courseId/bewertungsschema', loadComponent: () => import('./views/course/bewertungsschema-edit/bewertungsschema-edit.component').then(m => m.BewertungsschemaEditComponent) },
      { path: ':courseId/groups/:groupId/details', loadComponent: () => import('./views/course/group-detail/group-detail.component').then(m => m.GroupDetailComponent) }
    ]
  },
  {
    path: 'students',
    loadComponent: () => import('./views/student/student.component').then(m => m.StudentComponent),
    canActivate: [AuthGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'list' },
      { path: 'list', loadComponent: () => import('./views/student/student-list/student-list.component').then(m => m.StudentListComponent) },
      { path: ':id/details', loadComponent: () => import('./views/student/student-detail/student-detail.component').then(m => m.StudentDetailComponent) }
    ]
  },
  { path: 'notenspiegel', loadComponent: () => import('./views/notenspiegel/notenspiegel.component').then(m => m.NotenspiegelComponent) }
];
