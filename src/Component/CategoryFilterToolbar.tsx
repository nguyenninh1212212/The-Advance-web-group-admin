import { TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useListContext } from 'react-admin';
import React from 'react';

const CategoryFilterToolbar: React.FC = () => {
    const { filterValues, setFilters } = useListContext();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const q = e.target.value;
        if (q) {
            setFilters({ ...filterValues, q });
        } else {
            const { q, ...rest } = filterValues;
            setFilters(rest);
        }
    };

    return (
        <TextField
            variant="outlined"
            size="small"
            placeholder="Tìm kiếm tên thể loại..."
            value={filterValues.q || ''}
            onChange={handleChange}
            InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />
            }}
            sx={{ m: 2, minWidth: 300 }}
        />
    );
};

export default CategoryFilterToolbar;
