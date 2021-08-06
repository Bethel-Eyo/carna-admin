// @material-ui/icons
import Person from "@material-ui/icons/Person";
import LibraryBooks from "@material-ui/icons/LibraryBooks";
import Users from "views/Users/Users.js";
import Courses from "views/Courses/Courses.js";

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "All Users",
    // rtlName: "قائمة الجدول",
    icon: Person,
    component: Users,
    layout: "/admin",
  },
  {
    path: "/courses",
    name: "Courses",
    // rtlName: "طباعة",
    icon: LibraryBooks,
    component: Courses,
    layout: "/admin",
  },
];

export default dashboardRoutes;
