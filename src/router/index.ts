import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";
import CharacterList from "../views/CharacterList.vue";
import CharacterView from "../views/CharacterView.vue";

const routes: Array<RouteRecordRaw> = [
	{
		path: "/",
		name: "Home",
		component: Home
	},
	{
		path: "/list",
		name: "List",
		component: CharacterList
	},
	{
		path: "/character/:id",
		name: "Character",
		component: CharacterView
	},
	// {
	// 	path: "/about",
	// 	name: "About",
	// 	// route level code-splitting
	// 	// this generates a separate chunk (about.[hash].js) for this route
	// 	// which is lazy-loaded when the route is visited.
	// 	component: () => import(/* webpackChunkName: "about" */ "../views/About.vue")
	// }
];

const router = createRouter({
	history: createWebHashHistory(),
	routes
});

export default router;
