import DeleteIcon from '@mui/icons-material/Delete';
import { useRecordContext } from 'react-admin';
import { Button } from '@mui/material';

const DeletePopupButton = ({ onDelete }: { onDelete: (record: any) => void }) => {
    const record = useRecordContext();
    return (
        <Button
            onClick={() => onDelete(record)}
            title="Xóa"
            startIcon={<DeleteIcon />}
            color="error"
            variant="text"
        >
            Xóa
        </Button>
    );
};

export default DeletePopupButton;
