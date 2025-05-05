import { SimpleForm, TextInput, required, useNotify, useRefresh } from 'react-admin';
import { api } from '../../api'; // điều chỉnh đường dẫn nếu khác

const CategoryForm = ({ onSuccess }: { onSuccess: () => void }) => {
    const notify = useNotify();
    const refresh = useRefresh();

    const handleSubmit = async (data: any) => {
        try {
            const res = await api.post('/admin/category/add', JSON.stringify({ name: data.name }));

            notify(res.data.message || 'Thêm thể loại thành công', { type: 'success' });
            refresh(); // Làm mới danh sách
            onSuccess(); // Đóng form
        } catch (error: any) {
            const msg = error?.response?.data?.message || 'Đã xảy ra lỗi khi thêm thể loại';
            notify(msg, { type: 'error' });
        }
    };

    return (
        <SimpleForm onSubmit={handleSubmit}>
            <TextInput source="name" label="Tên thể loại" validate={[required()]} />
        </SimpleForm>
    );
};

export default CategoryForm;


/*
function email(): import("ra-core").Validator {
    return (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return value && !emailRegex.test(value) ? 'Email không hợp lệ' : undefined;
    };
}
*/