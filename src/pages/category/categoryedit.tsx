import { Edit, SimpleForm, TextInput, DateInput, required } from 'react-admin';

export const UserEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="Name" label="Tên thể loại" validate={[required()]} />
            <TextInput source="ID" label="ID" disabled/>
            <DateInput source="createdAt" label="Ngày tạo" disabled />
            <DateInput source="updatedAt" label="Ngày cập nhật" disabled />
        </SimpleForm>
    </Edit>
);