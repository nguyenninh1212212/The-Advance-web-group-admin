import { SimpleForm, TextInput, useNotify, useRedirect, required, TextField } from 'react-admin';
import { api } from '../../api';

const CategoryFormEdit = ({ record, onSuccess }: { record: any; onSuccess: () => void }) => {
    const notify = useNotify();

    const handleSubmit = async (data: any) => {
        console.log("Debugging Data Before Sending:", data); // Kiểm tra dữ liệu
    
        if (!data.id) {
            notify("Lỗi: ID không hợp lệ", { type: "error" });
            return;
        }
    
        try {
            const response = await api.put(`/admin/category/update`, {
                id: data.id,
                name: data.name,
            });
    
            console.log("Response from backend:", response.data);
            notify("Cập nhật thành công", { type: "success" });
            onSuccess();
        } catch (error: any) {
            console.error("Error updating category:", error?.response?.data);
            const msg = error?.response?.data?.message || "Cập nhật thất bại";
            notify(msg, { type: "error" });
        }
    };
 
    return (
        <SimpleForm onSubmit={handleSubmit} defaultValues={record}>
            <TextInput source="id" label="ID" inputProps={{ readOnly: true }}/>
            <TextInput source="name" label="Tên thể loại" validate={[required()]} />
        </SimpleForm>

    );
};

export default CategoryFormEdit;
