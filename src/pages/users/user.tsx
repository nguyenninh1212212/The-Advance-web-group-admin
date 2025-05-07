import {
    List,
    Datagrid,
    TextField,
    EmailField,
    useNotify,
    useRefresh,
    useRecordContext,
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
import { api } from '../../api'; // chỉnh path nếu khác

const StatusDropdown = () => {
    const record = useRecordContext();
    const [status, setStatus] = useState(() => {
        if (!record.active) return 'banned';
        return record.request ? 'priority' : 'active';
    });

    const [openConfirm, setOpenConfirm] = useState(false);
    const [selected, setSelected] = useState(status);
    const notify = useNotify();
    const refresh = useRefresh();

    const handleChange = (event: any) => {
        setSelected(event.target.value);
        setOpenConfirm(true);
    };

    const handleConfirm = async () => {
        try {
            if (selected === 'banned') {
                await api.post(`/admin/user/ban?id=${record.id}`);
                notify('Đã khóa tài khoản');
            } else if (selected === 'priority') {
                await api.post(`/admin/user/prioritize?id=${record.id}`);
                notify('Đã đánh dấu ưu tiên');
            } else {
                await api.post(`/admin/user/activate?id=${record.id}`);
                notify('Đã chuyển về hoạt động bình thường');
            }
            setStatus(selected);
            refresh();
        } catch (err: any) {
            notify(`Lỗi: ${err.message}`, { type: 'error' });
        } finally {
            setOpenConfirm(false);
        }
    };

    return (
        <>
            <FormControl fullWidth>
                <Select value={status} onChange={handleChange} size="small">
                    <MenuItem value="active">Hoạt động</MenuItem>
                    <MenuItem value="priority">Ưu tiên</MenuItem>
                    <MenuItem value="banned">Đã bị khóa</MenuItem>
                </Select>
            </FormControl>

            <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
                <DialogTitle>Xác nhận thay đổi trạng thái</DialogTitle>
                <DialogContent>Bạn có chắc muốn thay đổi trạng thái tài khoản?</DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenConfirm(false)}>Hủy</Button>
                    <Button onClick={handleConfirm} autoFocus>
                        Đồng ý
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

const UserList = () => (
    <List>
        <Datagrid>
            <TextField source="id" label="ID" />
            <TextField source="fullName" label="Họ và tên" />
            <EmailField source="email" label="Email" />
            <TextField source="createdAt" label="Ngày tạo" />
            <TextField source="updatedAt" label="Ngày cập nhật" />
            <TextField source="deleteAt" label="Ngày xóa" />

            <StatusDropdown /> {/* Cột trạng thái gộp cả request + active */}
        </Datagrid>
    </List>
);

export default UserList;
