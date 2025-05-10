import {
    List,
    Datagrid,
    TextField,
    ImageField,
    NumberField,
    ArrayField,
    SingleFieldList,
    ChipField,
    useNotify,
    useRefresh,
    useRecordContext,
    BooleanField,
    useListContext,
    TopToolbar,
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
    SelectChangeEvent,
    Box,
    Typography,
    Switch,
    FormControlLabel,
} from '@mui/material';
import { useState } from 'react';
import { useEffect } from 'react';
import { api } from '../../api';
import CustomInteractivePagination from '../../Component/CustomPagination';
import { StoryFilterToolbar } from '../../Component/SearchComponent'; // Import the horizontal filter toolbar
const VisibilityStatusDropdown = () => {
    const record = useRecordContext();
    const [value, setValue] = useState(record?.isAvailable || 'PENDING');
    const [openConfirm, setOpenConfirm] = useState(false);
    const [pendingValue, setPendingValue] = useState(value);
    const notify = useNotify();
    const refresh = useRefresh();

    const handleChange = (e: SelectChangeEvent<string>) => {
        setPendingValue(e.target.value);
        setOpenConfirm(true);
    };
    
    const handleConfirm = async () => {
        if (!record) return;
        try {
            await api.post('/admin/story/moderated', {
                story_id: record.id,
                isBanned: record.banned || false,
                isAvailable: pendingValue,
            });
            notify('Cập nhật trạng thái thành công');
            setValue(pendingValue);
            refresh();
        } catch (err) {
            notify(`Lỗi: ${err instanceof Error ? err.message : 'Unknown error'}`, { type: 'error' });
        } finally {
            setOpenConfirm(false);
        }
    };

    return (
        <>
            <FormControl fullWidth size="small" className="mb-2">
                <Select 
                    value={value} 
                    onChange={handleChange}
                    onClick={(e) => e.stopPropagation()}
                    className="text-sm"
                >
                    <MenuItem value="PENDING">Pending</MenuItem>
                    <MenuItem value="ACCEPTED">Accepted</MenuItem>
                    <MenuItem value="REJECTED">Rejected</MenuItem>
                </Select>
            </FormControl>
            <Dialog 
                open={openConfirm} 
                onClose={() => setOpenConfirm(false)}
            >
                <DialogTitle>Xác nhận thay đổi</DialogTitle>
                <DialogContent>
                    <Typography variant="body1" gutterBottom>
                        Bạn có chắc muốn thay đổi trạng thái của truyện từ <strong>{value}</strong> sang <strong>{pendingValue}</strong>?
                    </Typography>
                    {pendingValue === 'REJECTED' && (
                        <Typography variant="body2" color="error">
                            Lưu ý: Truyện bị từ chối sẽ không hiển thị cho người dùng.
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenConfirm(false)}>Hủy</Button>
                    <Button onClick={handleConfirm} color="primary" variant="contained" autoFocus>
                        Xác nhận
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

const BanStoryToggle = () => {
    const record = useRecordContext();
    const [banned, setBanned] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [pendingValue, setPendingValue] = useState(false);
    const notify = useNotify();
    const refresh = useRefresh();

    useEffect(() => {
        if (record?.banned !== undefined) {
            setBanned(record.banned);
            setPendingValue(record.banned);
        }
    }, [record]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPendingValue(e.target.checked);
        setOpenConfirm(true);
    };

    const handleConfirm = async () => {
        if (!record) return;
        try {
            await api.put(`/admin/story/${record.id}/ban-status?isBan=${pendingValue}`);
            notify(pendingValue ? 'Truyện đã bị ban thành công' : 'Truyện đã được bỏ ban thành công');
            setBanned(pendingValue);
            refresh();
        } catch (err) {
            console.error('Ban status update error:', err);
            notify(`Lỗi: ${err instanceof Error ? err.message : 'Unknown error'}`, { type: 'error' });
        } finally {
            setOpenConfirm(false);
        }
    };

    return (
        <>
            <FormControlLabel
                control={
                    <Switch 
                        checked={banned}
                        onChange={handleChange}
                        onClick={(e) => e.stopPropagation()}
                        color="error"
                        className="text-sm"
                    />
                }
                label=""
                className="mb-2"
            />
            <Dialog 
                open={openConfirm} 
                onClose={() => setOpenConfirm(false)}
            >
                <DialogTitle>Xác nhận {pendingValue ? 'ban' : 'unban'} truyện</DialogTitle>
                <DialogContent>
                    <Typography variant="body1" gutterBottom>
                        Bạn có chắc muốn {pendingValue ? 'ban' : 'unban'} truyện này?
                    </Typography>
                    {pendingValue && (
                        <Typography variant="body2" color="error">
                            Lưu ý: Truyện bị ban sẽ không hiển thị cho người dùng.
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenConfirm(false)}>Hủy</Button>
                    <Button onClick={handleConfirm} color="primary" variant="contained" autoFocus>
                        Xác nhận
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

// Empty toolbar to remove the default search field
//const EmptyToolbar = () => <TopToolbar />;

// Enhanced Story list component with horizontal filters
const StoryList = (props: any) => (
    <List
        {...props}
        pagination={<CustomInteractivePagination />}
        sort={{ field: 'isAvailable', order: 'ASC' }}
        perPage={10}
        filterDefaultValues={{ isAvailable: ['PENDING', 'ACCEPTED'] }}
        //actions={<EmptyToolbar />} // Remove default search field
        component="div" // Prevents wrapping in Card
    >
        <StoryFilterToolbar /> {/* Add horizontal filter toolbar */}
        <Datagrid rowClick="edit">
            <TextField source="id" label="ID" />
            <ImageField source="coverImage" label="Cover" />
            <TextField source="title" label="Title" />
            <TextField source="type" label="Type" />
            <TextField source="email" label="Author Email" />
            <NumberField source="view" label="Views" />
            <BooleanField source="visibility" label="Visible to Users" />
            <TextField source="status" label="Status" />
            <NumberField source="price" label="Price" options={{ style: 'currency', currency: 'VND' }} />
            <TextField source="updatedAt" label="Updated At" />
            <ArrayField source="categories" label="Categories">
                <SingleFieldList>
                    <ChipField source="name" />
                </SingleFieldList>
            </ArrayField>
            <VisibilityStatusDropdown label="Visibility Status"/>
            <BanStoryToggle label="Ban"/>
        </Datagrid>
    </List>
);

export default StoryList;