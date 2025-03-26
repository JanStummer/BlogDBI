import { Routes } from '@angular/router';
import { FootballBlogComponent } from './football-blog/football-blog.component';

export const routes: Routes = [
  {path: 'football-blog', component: FootballBlogComponent},
  {path: '', redirectTo: '/football-blog', pathMatch: 'full'}
];
