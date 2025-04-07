import { DateField, EmailField, Show, SimpleShowLayout, TextField } from 'react-admin';

const UserShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="name" />
            <EmailField source="email" />
            <TextField source="role" />
            <DateField source="created_at" />
        </SimpleShowLayout>
    </Show>
);

export default UserShow;