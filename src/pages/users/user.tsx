import { Datagrid, DateField, EmailField, List, TextField } from 'react-admin';

const UserList = () => (
    <List>
        <Datagrid>
            <TextField source="id" label="ID" />
            <TextField source="fullName" label="Họ và tên" />
            <EmailField source="email" label="Email" />
            <DateField source="createdAt" label="Ngày tạo" />
            <DateField source="updatedAt" label="Ngày cập nhật" />
            <TextField source="deleteAt" label="Ngày xóa" />
        </Datagrid>
    </List>
);

export default UserList;