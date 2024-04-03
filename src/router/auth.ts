import UserRichcleView from "@/views/auth/user-richcle/UserRichclePage.vue";
import UserLoginPageView from "@/views/auth/user/UserLoginPage.vue";

export const routesAuth = [
  {
    path: "/auth/login/user",
    name: "userLogin",
    component: UserRichcleView,
  },
];
