import { Create, SimpleForm, TextInput, required } from 'react-admin';

export const CategoryCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="Name" label="Tên thể loại" validate={[required()]} />
        </SimpleForm>
    </Create>
);
/*
function email(): import("ra-core").Validator {
    return (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return value && !emailRegex.test(value) ? 'Email không hợp lệ' : undefined;
    };
}
*/