import {
    List,
    Datagrid,
    TextField,
    NumberField,
    FunctionField,
} from 'react-admin';
import { Chip } from '@mui/material';
import CustomPagination from '../../Component/CustomPagination'; // nếu bạn có component phân trang riêng

const StatusChip = ({ status }: { status: string }) => {
    const color =
        status === 'PENDING' ? 'warning' :
        status === 'SUCCESS' ? 'success' :
        status === 'FAILED' ? 'error' : 'default';

    return <Chip label={status} color={color as any} size="small" />;
};

const WalletTransactionList = (props: any) => {
    return (
        <List
            {...props}
            pagination={<CustomPagination />}
            perPage={10}
            sort={{ field: 'createdAt', order: 'DESC' }}
        >
            <Datagrid
                rowClick="show"
                sx={{
                    '& .RaDatagrid-headerCell': {
                        backgroundColor: '#1976d2',
                        color: '#fff',
                        fontWeight: 'bold',
                    },
                }}
            >
                <TextField source="fullName" label="Full Name" />
                <TextField source="email" label="Email" />
                <TextField source="transactionType" label="Type" />
                <TextField source="description" label="Description" />
                <NumberField source="amount" label="Amount" options={{ style: 'currency', currency: 'VND' }} />
                <NumberField source="balance" label="Balance" options={{ style: 'currency', currency: 'VND' }} />
                <FunctionField
                    label="Status"
                    render={record => <StatusChip status={record.status} />}
                />
            </Datagrid>
        </List>
    );
};

export default WalletTransactionList;
