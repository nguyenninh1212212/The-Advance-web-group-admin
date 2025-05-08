import {
    List,
    Datagrid,
    TextField,
    EmailField,
    useNotify,
    useRefresh,
    useRecordContext,
    BooleanField,
} from 'react-admin';
import {
    Select,
    MenuItem,
    FormControl,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from '@mui/material';
import { useState } from 'react';
import { api } from '../../api';

// Component dropdown trạng thái active
const ActiveStatusDropdown = () => {
    const record = useRecordContext();
    const [value, setValue] = useState(record?.active ? 'active' : 'banned');
    const [openConfirm, setOpenConfirm] = useState(false);
    const [pendingValue, setPendingValue] = useState(value);
    const notify = useNotify();
    const refresh = useRefresh();

    const handleChange = (e: any) => {
        setPendingValue(e.target.value);
        setOpenConfirm(true);
    };

    const handleConfirm = async () => {
        if (!record) return;
        try {
            if (pendingValue === 'banned') {
                await api.put(`/admin/user/${record.id}/deactivate`);
                notify('Đã khóa tài khoản');
            } else {
                await api.put(`/admin/user/${record.id}/activate`);
                notify('Đã kích hoạt tài khoản');
            }
            setValue(pendingValue);
            refresh();
        } catch (err: any) {
            notify(`Lỗi: ${err.message}`, { type: 'error' });
        } finally {
            setOpenConfirm(false);
        }
    };

    return (
        <>
            <FormControl fullWidth size="small">
                <Select value={value} onChange={handleChange}>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="banned">Banned</MenuItem>
                </Select>
            </FormControl>
            <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
                <DialogTitle>Xác nhận thay đổi</DialogTitle>
                <DialogContent>Bạn có chắc muốn thay đổi trạng thái tài khoản?</DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenConfirm(false)}>Hủy</Button>
                    <Button onClick={handleConfirm} autoFocus>
                        Xác nhận
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

// Hiển thị trạng thái request
const RequestStatus = () => {
    const record = useRecordContext();
    return <span>{record?.request ? '✅ Đã yêu cầu' : '—'}</span>;
};

// Danh sách người dùng
const UserList = () => (
    <List sort={{ field: 'request', order: 'ASC' }}>
        <Datagrid rowClick="none">
            <TextField source="id" label="ID" />
            <TextField source="fullName" label="Họ và tên" />
            <EmailField source="email" label="Email" />
            <TextField source="createdAt" label="Ngày tạo" />
            <TextField source="updatedAt" label="Ngày cập nhật" />
            <TextField source="deleteAt" label="Ngày xóa" />
            <ActiveStatusDropdown />
            <RequestStatus />
        </Datagrid>
    </List>
);

export default UserList;
