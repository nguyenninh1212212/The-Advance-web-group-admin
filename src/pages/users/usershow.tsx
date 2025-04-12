import { DateField, EmailField, Show, SimpleShowLayout, TextField } from 'react-admin';

const UserShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" label="ID" />
            <TextField source="fullName" label="Họ và tên" />
            <EmailField source="email" label="Email" />
            <DateField source="createdAt" label="Ngày tạo" />
            <DateField source="updatedAt" label="Ngày cập nhật" />
            <TextField source="deleteAt" label="Ngày xóa" />
        </SimpleShowLayout>
    </Show>
);

export default UserShow;