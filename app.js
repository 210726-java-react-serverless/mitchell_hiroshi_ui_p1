import navbarComponent from './components/navbar/navbar.component.js';
import loginComponent from './components/login/login.component.js';
import registerComponent from './components/register/register.component.js';
import dashboardComponent from './components/dashboard/dashboard.component.js';
import adminDashboardComponent from './components/admindashboard/admindashboard.component.js';

import { Router } from "./util/router.js";

//-----------------------------------------------------------------------------------

let routes = [
    {
        path: '/login',
        component: loginComponent
    },
    {
        path: '/register',
        component: registerComponent
    },
    {
        path: '/dashboard',
        component: dashboardComponent
    },
    {
        path: '/admindashboard',
        component: adminDashboardComponent
    }
];

const router = new Router(routes);

window.onload = () => {
    navbarComponent.render();
    router.navigate('/dashboard');
}

export default router;