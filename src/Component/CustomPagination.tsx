import { useListContext } from 'react-admin';
import { Button, Grid, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';

const CustomInteractivePagination = () => {
    const {
        page,
        perPage,
        setPage,
        setPerPage,
        total,
    } = useListContext();

    // Calculate total pages
    const totalPages = total ? Math.ceil(total / perPage) : 0;
    
    // Handle page change
    const goToPage = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    // Handle rows per page change
    const handleRowsPerPageChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setPerPage(event.target.value as number);
        setPage(1); // Reset to first page
    };

    return (
        <Grid container spacing={2} alignItems="center" justifyContent="flex-end" sx={{ mt: 2, mb: 2, pr: 2 }}>
            {/* Rows per page selector */}
            <Grid item>
                <FormControl size="small" variant="outlined">
                    <InputLabel id="rows-per-page-label">Rows</InputLabel>
                    <Select
                        labelId="rows-per-page-label"
                        value={perPage}
                        onChange={handleRowsPerPageChange as any}
                        label="Rows"
                    >
                        <MenuItem value={5}>5</MenuItem>
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={25}>25</MenuItem>
                        <MenuItem value={50}>50</MenuItem>
                        <MenuItem value={100}>100</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            
            {/* Page info */}
            <Grid item>
                <Typography variant="body2">
                    {total ? `${(page - 1) * perPage + 1}-${Math.min(page * perPage, total)} of ${total}` : '0-0 of 0'}
                </Typography>
            </Grid>
            
            {/* Navigation buttons */}
            <Grid item>
                <Button 
                    onClick={() => goToPage(1)} 
                    disabled={page <= 1}
                    size="small"
                >
                    <FirstPageIcon />
                </Button>
                <Button 
                    onClick={() => goToPage(page - 1)} 
                    disabled={page <= 1}
                    size="small"
                >
                    <ChevronLeftIcon />
                </Button>
                <Button 
                    onClick={() => goToPage(page + 1)} 
                    disabled={page >= totalPages}
                    size="small"
                >
                    <ChevronRightIcon />
                </Button>
                <Button 
                    onClick={() => goToPage(totalPages)} 
                    disabled={page >= totalPages}
                    size="small"
                >
                    <LastPageIcon />
                </Button>
            </Grid>
        </Grid>
    );
};

export default CustomInteractivePagination;