import { Admin, Resource, ListGuesser } from "react-admin";
import { Layout } from "./Layout";
import dataProvider  from "./fakeDataProvider";
import { Comment, People, PostAdd } from "@mui/icons-material";

export const App = () => 
    <Admin layout={Layout} dataProvider={dataProvider} >
        <Resource name="users" list={ListGuesser} icon={People} />
        <Resource name="posts" list={ListGuesser} icon={PostAdd}/>
        <Resource name="comments" list={ListGuesser} icon={Comment}/>
    </Admin>;
