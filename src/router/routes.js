import Home from "@/pages/home.vue";
import Login from "@/pages/login.vue";
import planSearch from "@/pages/plan/plan-search.vue";
import planningInformation from "@/pages/plan/planning-information.vue";
import logErrorList from "@/pages/common-master/application-log/log-error-list.vue";
import logBatchList from "@/pages/common-master/application-log/log-batch-list.vue";
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
    path: "/common-master/predefine-item",
    name: "predefine-item",
    meta: {
      menuNo: "M1010",
    },
    component: () =>
      import("@/pages/common-master/predefine-item/predefine-item.vue"),
  },
  {
    path: "/common-master/predefine-item-process",
    name: "predefine-item-process",
    meta: {
      menuNo: "M1010",
    },
    component: () =>
      import("@/pages/common-master/predefine-item-process/predefine.vue"),
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
        path: "/common-master/application-log/log-error-list",
        name: "log-error-list",
        component: logErrorList,
      },
      {
        path: "/common-master/application-log/log-batchjob-list",
        name: "log-batchjob-list",
        component: logBatchList,
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
        component: planSearch,
      },
      {
        path: "/plan/planning-info/:id?",
        name: "planning-info",
        component: planningInformation,
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
    path: "/line-stop",
    meta: {
      requireAuth: false,
    },
    children: [
      {
        path: "",
        name: "line-stop-search",
        component: () => import("@/pages/line-stop/line-stop-search.vue"),
      },
      {
        path: "/line-stop-info/:id?",
        name: "line-stop-info",
        component: () => import("@/pages/line-stop/line-stop-info.vue"),
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
        path: "/common-master/machine-info/:id?/:processCd?",
        name: "machine-info",
        component: () =>
          import("@/pages/common-master/machine/machine-info.vue"),
      },
    ],
  },
  {
    path: "/common-master/information-alert",
    meta: {
      menuNo: "M1008",
    },
    children: [
      {
        path: "",
        name: "information-alert",
        component: () =>
          import(
            "@/pages/common-master/information-alert/information-alert.vue"
          ),
      },
    ],
  },
  {
    path: "/common-master/team",
    meta: {
      menuNo: "M1009",
    },
    children: [
      {
        path: "",
        name: "team",
        component: () => import("@/pages/common-master/team/team.vue"),
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

  {
    path: "/reports/report-efficiency-oper",
    meta: {
      menuNo: "M3001",
    },
    component: () => import("@/pages/reports/report-efficiency-oper.vue"),
  },
  {
    path: "/download-apk",
    meta: {
      requireAuth: false,
    },
    component: () => import("@/pages/download-apk.vue"),
  },
];

export default routes;
