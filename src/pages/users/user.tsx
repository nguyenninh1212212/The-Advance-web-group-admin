import { 
    List, 
    Datagrid, 
    TextField, 
    EmailField, 
    DateField,
    EditButton,
    DeleteButton
} from 'react-admin';

// Custom component để hiển thị ID ngắn gọn
const TruncatedTextField = ({ record }: any) => {
    const value = record?.id || '';
    const truncated = value.length > 8 ? `${value.substring(0, 8)}...` : value;
    return <span title={value}>{truncated}</span>;
};

const UserList = () => (
    <List>
        <Datagrid>
            <TextField 
                source="id" 
                label="ID"
                component={TruncatedTextField}
            />
            <TextField source="fullName" label="Họ và tên" />
            <EmailField source="email" label="Email" />
            <TextField  
                source="createdAt" 
                label="Ngày tạo"
            />
            <TextField
                source="updatedAt" 
                label="Ngày cập nhật"
            />
            <TextField source="deleteAt" label="Ngày xóa" />

        </Datagrid>
    </List>
);

export default UserList;
//<EditButton label="Sửa"/>
//<DeleteButton label="Xóa"/>