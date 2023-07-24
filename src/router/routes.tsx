import { RouteObject } from "react-router-dom";
import Login from "../pages/login";
import Logout from "../pages/logout";
import SingleBlue from "../pages/singleblue";
import Auth from "./Auth";
import Home from "../pages/home";

const Routes: RouteObject[] = [
    {
        path: '/blue/:repo/:cid',
        element: <Auth><SingleBlue /></Auth>
    },
    {
        path: '/login',
        element: <Login />,
    }, {
        path: '/logout',
        element: <Logout />
    }, {
        path: '/',
        element: <Auth><Home /></Auth>
    }


]

export default Routes;