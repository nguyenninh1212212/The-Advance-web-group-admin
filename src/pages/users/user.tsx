import { Datagrid, DateField, EmailField, List, TextField } from 'react-admin';

const UserList = () => (
    <List>
        <Datagrid>
            <TextField source="id" />
            <TextField source="name" />
            <EmailField source="email" />
            <TextField source="role" />
            <DateField source="created_at" />
        </Datagrid>
    </List>
);

export default UserList;