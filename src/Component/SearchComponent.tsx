import React, { useState, useEffect } from 'react';
import { useListContext } from 'react-admin';
import {
    Autocomplete,
    TextField as MuiTextField,
    CircularProgress,
    Paper,
    Grid,
    Tooltip,
    FormControlLabel,
    Switch,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CategoryIcon from '@mui/icons-material/Category';
import { api } from '../api';

// Category filter: emits cateId
const CategoryFilter: React.FC = () => {
    const { filterValues, setFilters } = useListContext();
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const response = await api.get('/admin/category');
                const sorted = (response.data?.result?.data ?? []).sort((a: any, b: any) =>
                    a.name.localeCompare(b.name)
                );
                setCategories(sorted);
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (_: any, newId: string | null) => {
        if (newId) {
            setFilters({ ...filterValues, cateId: newId }, {});
        } else {
            const { cateId, ...rest } = filterValues;
            setFilters(rest, {});
        }
    };

    return (
        <Autocomplete
            sx={{ minWidth: 200 }}
            size="small"
            options={categories.map(c => c.id)}
            loading={loading}
            value={filterValues?.cateId || null}
            onChange={handleChange}
            getOptionLabel={id => categories.find(c => c.id === id)?.name || ''}
            renderInput={params => (
                <MuiTextField
                    {...params}
                    label="Category"
                    InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                            <>
                                <CategoryIcon fontSize="small" sx={{ mr: 1, color: 'action.active' }} />
                                {params.InputProps.startAdornment}
                            </>
                        ),
                        endAdornment: (
                            <>
                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </>
                        ),
                    }}
                />
            )}
        />
    );
};

// Keyword search: emits q
const KeywordSearch: React.FC = () => {
    const { filterValues, setFilters } = useListContext();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value) {
            setFilters({ ...filterValues, q: value }, {});
        } else {
            const { q, ...rest } = filterValues;
            setFilters(rest, {});
        }
    };

    return (
        <MuiTextField
            sx={{ minWidth: 300 }}
            size="small"
            variant="outlined"
            label="Search"
            value={filterValues.q || ''}
            onChange={handleChange}
            InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} /> }}
        />
    );
};

// Combined toolbar
export const StoryFilterToolbar: React.FC = () => {
    const { filterValues, setFilters } = useListContext();

    const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        if (checked) {
            const { isAvailable, ...rest } = filterValues;
            setFilters(rest, {});
        } else {
            setFilters({ ...filterValues, isAvailable: ['PENDING', 'ACCEPTED'] }, {});
        }
    };

    useEffect(() => {
        if (!filterValues.isAvailable) {
            setFilters({ ...filterValues, isAvailable: ['PENDING', 'ACCEPTED'] }, {});
        }
    }, []);

    const showRejected = !filterValues.isAvailable;

    return (
        <Paper sx={{ p: 2, mb: 2 }}>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={4}>
                    <KeywordSearch />
                </Grid>
                <Grid item xs={6} sm={3}>
                    <CategoryFilter />
                </Grid>
                <Grid item xs={12} sm={2}>
                    <Tooltip title="Show rejected stories">
                        <FormControlLabel
                            control={<Switch checked={showRejected} onChange={handleToggle} size="small" />}
                            label="Show Rejected"
                            sx={{ ml: 1 }}
                        />
                    </Tooltip>
                </Grid>
            </Grid>
        </Paper>
    );
};
