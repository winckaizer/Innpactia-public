import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ClientComponent } from './components/client/client.component';
import { PhoneComponent } from './components/phone/phone.component';
import { RepairListComponent } from './components/repair-list/repair-list.component';
import { RepairComponent } from './components/repair/repair.component';
import { UserComponent } from './components/user/user.component';


const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: ''},
  {path: 'client', component: ClientComponent},
  {path: 'phone', component: PhoneComponent},
  {path: 'repair', component: RepairComponent},
  {path: 'repair/:id', component: RepairComponent},
  {path: 'user', component: UserComponent},
  {path: 'repair-list', component: RepairListComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
