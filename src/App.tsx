import { Admin, Resource, ListGuesser } from "react-admin";
import { Comment, People, PostAdd } from "@mui/icons-material";
import { Layout } from "./Layout";
import dataProvider from "./fakeDataProvider";
import UserList from "./pages/users/user";
import PostList from "./pages/posts/post";
import UserShow from "./pages/users/usershow";
import Dashboard from "./pages/dashboard/Dashboard"; // Import Dashboard

export const App = () => (
    <Admin layout={Layout} dataProvider={dataProvider} dashboard={Dashboard}>
        <Resource name="users" list={UserList} icon={People} show={UserShow} />
        <Resource name="posts" list={PostList} icon={PostAdd} />
        <Resource name="comments" list={ListGuesser} icon={Comment} />
    </Admin>
);
