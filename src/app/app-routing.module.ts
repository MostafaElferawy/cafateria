import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { PostListComponent } from "./home/post-list/post-list.component";
import { OrdersComponent } from "./orders/orders.component";
import { ProductListComponent } from "./products/product-list/product-list.component"; 
import { ProductCreateComponent } from "./products/product-create/product-create.component";
import { LoginComponent } from "./auth/login/login.component";
import { SignupComponent } from "./auth/signup/signup.component";
import { AuthGuard } from "./auth/auth.guard";
import { ChecksComponent } from "./checks/checks.component";
import { UsersComponent } from "./users/users.component";
import { CreateUserComponent } from "./users/create-user/create-user.component";

const routes: Routes = [
  { path: "", component: PostListComponent ,canActivate: [AuthGuard]},
  { path: "products/create", component: ProductCreateComponent, canActivate: [AuthGuard] },
  { path: "edit/:postId", component: ProductCreateComponent, canActivate: [AuthGuard] },
  { path: "products", component: ProductListComponent, canActivate: [AuthGuard] },
  { path: "orders", component: OrdersComponent, canActivate: [AuthGuard] },
  { path: "checks", component: ChecksComponent, canActivate: [AuthGuard] },
  { path: "users", component: UsersComponent, canActivate: [AuthGuard] },
  { path: "users/create", component: CreateUserComponent, canActivate: [AuthGuard] },
  { path: "login", component: LoginComponent },
  { path: "signup", component: SignupComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
