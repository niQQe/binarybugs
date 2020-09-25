import Vue from 'vue';
import Dashboard from '@/views/Dashboard';
import Login from '@/components/Login';
import Home from '@/views/Home';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
	{
		path: '/login',
		name: 'Login',
		component: Login,
	},
	{
		path: '/',
		name: 'Home',
		component: Home,
		children: [
			{
				name: 'Dashboard',
				path: '',
				component: Dashboard,
			},
		],
	},
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
