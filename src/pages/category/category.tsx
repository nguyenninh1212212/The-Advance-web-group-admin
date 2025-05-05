import {
    List,
    Datagrid,
    TextField,
    TopToolbar,
    ExportButton,
    Button,
    useRecordContext,
} from 'react-admin';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import { useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import CategoryFormEdit from './categoryedit'; // component form sửa
import CategoryForm from './categorycreate';
import { api } from '../../api';
import DeletePopupButton from './categorydelete';

const ListActions = ({ onOpen }: { onOpen: () => void }) => (
    <TopToolbar>
        <Button variant="contained" onClick={onOpen}>
            Thêm thể loại
        </Button>
        <ExportButton />
    </TopToolbar>
);

// Custom button để mở popup sửa
const EditPopupButton = ({ onEdit }: { onEdit: (record: any) => void }) => {
    const record = useRecordContext(); // Gọi đúng chỗ

    return (
        <Button onClick={() => onEdit(record)} title="Sửa" startIcon={<EditIcon />} variant="text">
            Sửa
        </Button>
    );
};


const CategoriesList = (props: any) => {
    const [openCreate, setOpenCreate] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [editRecord, setEditRecord] = useState<any>(null);
    const [openDelete, setOpenDelete] = useState(false);
    const [deleteRecord, setDeleteRecord] = useState<any>(null);


    const handleOpenCreate = () => setOpenCreate(true);
    const handleCloseCreate = () => setOpenCreate(false);

    const handleOpenEdit = (record: any) => {
        setEditRecord(record);
        setOpenEdit(true);
    };
    const handleCloseEdit = () => {
        setEditRecord(null);
        setOpenEdit(false);
    };

    const handleOpenDelete = (record: any) => {
        setDeleteRecord(record);
        setOpenDelete(true);
    };
    
    const handleCloseDelete = () => {
        setDeleteRecord(null);
        setOpenDelete(false);
    };
    
    const handleConfirmDelete = async () => {
        if (!deleteRecord) return;
        try {
            await api.post(`/admin/category/delete?id=${deleteRecord.id}`);
            setOpenDelete(false);
            setDeleteRecord(null);
            window.location.reload(); // hoặc dùng refresh() từ react-admin nếu bạn đã khai báo
        } catch (error) {
            console.error("Xóa thất bại", error);
        }
    };
    

    return (
        <>
            <List {...props} actions={<ListActions onOpen={handleOpenCreate} />}>
                <Datagrid
                    sx={{
                        '& .RaDatagrid-headerCell': {
                            backgroundColor: '#3f51b5',
                            color: '#fff',
                            padding: '16px',
                            fontWeight: 'bold',
                        },
                    }}
                >
                    <TextField source="id" />
                    <TextField source="name" label="Category name" />
                    <TextField source="createdAt" label="Created At" />
                    <TextField source="updatedAt" label="Updated At" />
                    <EditPopupButton onEdit={handleOpenEdit} />
                    <DeletePopupButton onDelete={handleOpenDelete} />
                </Datagrid>
            </List>

            {/* Popup tạo mới */}
            <Dialog open={openCreate} onClose={handleCloseCreate} maxWidth="sm" fullWidth>
                <DialogTitle>Thêm thể loại</DialogTitle>
                <DialogContent>
                    <CategoryForm onSuccess={handleCloseCreate} />
                </DialogContent>
            </Dialog>

            {/* Popup sửa */}
            <Dialog open={openEdit} onClose={handleCloseEdit} maxWidth="sm" fullWidth>
                <DialogTitle>Sửa thể loại</DialogTitle>
                <DialogContent>
                    {editRecord && <CategoryFormEdit record={editRecord} onSuccess={handleCloseEdit} />}
                </DialogContent>
            </Dialog>    
            {/* Popup xóa */}
            <Dialog open={openDelete} onClose={handleCloseDelete}>
                <DialogTitle>Xác nhận xóa</DialogTitle>
                <DialogContent>
                    <p>Bạn có chắc muốn xóa thể loại <strong>{deleteRecord?.name}</strong>?</p>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                        <Button onClick={handleCloseDelete}>Hủy</Button>
                        <Button color="error" onClick={handleConfirmDelete} variant="contained">Xóa</Button>
                    </div>
                </DialogContent>
            </Dialog>

        </>
    );
};

export default CategoriesList;
