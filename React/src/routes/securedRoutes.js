import { lazy } from "react";

const Chat = lazy(() => import("../components/chat/Chat"));

const appRoutes = [
  {
    path: "/chat",
    name: "Chat",
    exact: true,
    element: Chat,
    roles: ["User"],
    isAnonymous: true,
  },
];

const allRoutes = [...appRoutes];

export default allRoutes;
