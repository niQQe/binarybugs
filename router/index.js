import Vue from 'vue';
import Dashboard from '@/components/Dashboard';
import Login from '@/components/Login';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
	{
		path: '/',
		name: 'Login',
		component: Login,
	},
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: Dashboard,
	}
];

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes,
});

// const onAuthRequired = async (from, to, next) => {
// 	console.log(await Vue.prototype.$auth.checkAuth())
// 	if (from.matched.some((record) => record.meta.requiresAuth) && !(await Vue.prototype.$auth.checkAuth())) {
// 		next({ path: '/login' });
// 	} else {
// 		next();
// 	}
// };

// router.beforeEach(onAuthRequired);

export default router;
