import Home from "@/pages/home.vue";
import Login from "@/pages/login.vue";

const routes = [
  {
    path: "/",
    name: "/",
    component: Home,
  },
  {
    path: "/login",
    name: "login",
    component: Login,
    meta: {
      requireAuth: false,
    },
  },
  {
    path: "/application-information",
    name: "application-information",
    component: () =>
      import("@/pages/application-information/application-information.vue"),
    meta: {
      requireAuth: false,
    },
  },
  {
    path: "/common-master/user",
    meta: {
      menuNo: "M1001",
    },
    children: [
      {
        path: "",
        name: "user",
        component: () => import("@/pages/common-master/user/user-list.vue"),
      },
      {
        path: "/common-master/user-info/:id?",
        name: "user-info",
        component: () => import("@/pages/common-master/user/user-info.vue"),
      },
    ],
  },
  {
    path: "/common-master/role-permission",
    name: "role-permission",
    meta: {
      menuNo: "M1002",
    },
    component: () =>
      import("@/pages/common-master/role-permission/role-permission.vue"),
  },
  {
    path: "/common-master/predefine",
    name: "predefine",
    meta: {
      menuNo: "M1003",
    },
    component: () => import("@/pages/common-master/predefine/predefine.vue"),
  },
  {
    path: "/common-master/menu",
    meta: {
      menuNo: "M1004",
    },
    children: [
      {
        path: "",
        name: "menu",
        component: () => import("@/pages/common-master/menu/menu-list.vue"),
      },
      {
        path: "/common-master/menu-info/:id?",
        name: "menu-info",
        component: () => import("@/pages/common-master/menu/menu-info.vue"),
      },
    ],
  },
  {
    path: "/common-master/application-log",
    meta: {
      menuNo: "M1005",
    },
    children: [
      {
        path: "",
        name: "application-log",
        component: () =>
          import("@/pages/common-master/application-log/log-list.vue"),
      },
      {
        path: "/common-master/application-log/preview-log/:logtype/:filename",
        name: "application-log-preview",
        component: () =>
          import("@/pages/common-master/application-log/preview-log.vue"),
      },
    ],
  },
  {
    path: "/plan",
    meta: {
      menuNo: "M2002",
    },
    children: [
      {
        path: "",
        name: "plan-search",
        component: () => import("@/pages/plan/plan-search.vue"),
      },
    ],
  },
  {
    path: "/ng",
    meta: {
      requireAuth: false,
    },
    children: [
      {
        path: "",
        name: "ng-search",
        component: () => import("@/pages/ng/ng-search.vue"),
      },
      {
        path: "/ng-info/:id?",
        name: "ng-info",
        component: () => import("@/pages/ng/ng-info.vue"),
      },
    ],
  },
  {
    path: "/common-master/model",
    meta: {
      menuNo: "M1006",
    },
    children: [
      {
        path: "",
        name: "model",
        component: () => import("@/pages/common-master/model/model.vue"),
      },
    ],
  },
  {
    path: "/common-master/machine",
    meta: {
      menuNo: "M1007",
    },
    children: [
      {
        path: "",
        name: "machine",
        component: () => import("@/pages/common-master/machine/machine.vue"),
      },
      {
        path: "/common-master/machine-info/:id?",
        name: "machine-info",
        component: () =>
          import("@/pages/common-master/machine/machine-info.vue"),
      },
    ],
  },
  {
    path: "/line",
    meta: {
      menuNo: "M2001",
    },
    children: [
      {
        path: "",
        name: "line-search",
        component: () => import("@/pages/line/line-search.vue"),
      },
      {
        path: "line-info/:id?",
        name: "line-info",
        component: () => import("@/pages/line/line-info.vue"),
      },
    ],
  },
];

export default routes;
