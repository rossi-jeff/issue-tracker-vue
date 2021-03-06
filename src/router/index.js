import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    // route level code-splitting
    // this generates a separate chunk (dashboard.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "dashboard" */ "../views/Dashboard.vue")
  },
  {
    path: "/issues",
    name: "Issues",
    // route level code-splitting
    // this generates a separate chunk (issues.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "issues" */ "../views/Issues.vue")
  },
  {
    path: "/issues/new",
    name: "IssueNew",
    // route level code-splitting
    // this generates a separate chunk (issue_new.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "issue_new" */ "../views/IssueNew.vue")
  },
  {
    path: "/users",
    name: "Users",
    // route level code-splitting
    // this generates a separate chunk (users.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "users" */ "../views/Users.vue")
  },
  {
    path: "/users/new",
    name: "UserNew",
    // route level code-splitting
    // this generates a separate chunk (user_new.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "user_new" */ "../views/UserNew.vue")
  },
  {
    path: "/issues/:uuid",
    name: "IssueDetail",
    // route level code-splitting
    // this generates a separate chunk (issue_detail.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "issue_detail" */ "../views/IssueDetail.vue")
  },
  {
    path: "/users/:uuid",
    name: "UserDetail",
    // route level code-splitting
    // this generates a separate chunk (user_detail.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "user_detail" */ "../views/UserDetail.vue")
  },
  {
    path: "/projects",
    name: "Projects",
    // route level code-splitting
    // this generates a separate chunk (projects.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "projects" */ "../views/Projects.vue")
  },
  {
    path: "/projects/new",
    name: "ProjectNew",
    // route level code-splitting
    // this generates a separate chunk (project_new.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "project_new" */ "../views/ProjectNew.vue")
  },
  {
    path: "/projects/:uuid",
    name: "ProjectDetail",
    // route level code-splitting
    // this generates a separate chunk (project_detail.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(
        /* webpackChunkName: "project_detail" */ "../views/ProjectDetail.vue"
      )
  },
  {
    path: "/time_clock",
    name: "TimeClock",
    // route level code-splitting
    // this generates a separate chunk (time_clock.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "time_clock" */ "../views/TimeClock.vue")
  },
  {
    path: "/time_clock/new",
    name: "TimeClockNew",
    // route level code-splitting
    // this generates a separate chunk (time_clock_new.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(
        /* webpackChunkName: "time_clock_new" */ "../views/TimeClockNew.vue"
      )
  },
  {
    path: "/time_clock/:uuid",
    name: "TimeClockDetail",
    // route level code-splitting
    // this generates a separate chunk (time_clock_detail.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(
        /* webpackChunkName: "time_clock_detail" */ "../views/TimeClockDetail.vue"
      )
  },
  {
    path: "/profile/:uuid",
    name: "Profile",
    // route level code-splitting
    // this generates a separate chunk (profile.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "profile" */ "../views/Profile.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
