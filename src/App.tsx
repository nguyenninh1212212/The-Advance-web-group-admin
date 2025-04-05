import { Admin, Resource, ListGuesser, EditGuesser, ShowGuesser } from 'react-admin';
import { dataProvider } from './dataProvider';
import { Layout } from "./Layout";

const App = () => (
    <Admin dataProvider={dataProvider}>

    </Admin>
);

export default App;
