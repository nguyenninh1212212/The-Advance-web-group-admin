import React, { useState, useEffect } from 'react';
import {
    SearchInput,
    FilterList,
    FilterListItem,
    useListContext,
    useGetList,
    FilterLiveSearch,
} from 'react-admin';
import {
    Box,
    Chip,
    Autocomplete,
    TextField as MuiTextField,
    CircularProgress,
    Button,
    Switch,
    FormControlLabel,
    Paper,
    Stack,
    Divider,
    Grid,
    Tooltip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import CategoryIcon from '@mui/icons-material/Category';
import PersonIcon from '@mui/icons-material/Person';
import { api } from '../api';

// Author filter component that uses Autocomplete
const AuthorFilter = () => {
    const { filterValues, setFilters } = useListContext();
    const [authors, setAuthors] = useState<{ id: string, email: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null);

    useEffect(() => {
        const fetchAuthors = async () => {
            try {
                setLoading(true);
                const response = await api.get('/admin/authors');
                setAuthors(response.data);
            } catch (error) {
                console.error('Error fetching authors:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAuthors();
    }, []);

    const handleAuthorChange = (event: any, newValue: string | null) => {
        setSelectedAuthor(newValue);
        if (newValue) {
            setFilters({ ...filterValues, email: newValue }, {});
        } else {
            const { email, ...restFilters } = filterValues;
            setFilters(restFilters, {});
        }
    };

    return (
        <Autocomplete
            sx={{ minWidth: 200 }}
            size="small"
            options={authors.map(author => author.email)}
            loading={loading}
            value={selectedAuthor}
            onChange={handleAuthorChange}
            renderInput={(params) => (
                <MuiTextField
                    {...params}
                    label="Author"
                    InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                            <>
                                <PersonIcon fontSize="small" sx={{ mr: 1, color: 'action.active' }} />
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

// Category filter component that uses Autocomplete
const CategoryFilter = () => {
    const { filterValues, setFilters } = useListContext();
    const [category, setCategory] = useState<{ id: string, name: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const response = await api.get('/admin/category');
                const categories = (response.data?.result?.data ?? []).sort((a: any, b: any) =>
                    a.name.localeCompare(b.name)
                );
                setCategory(categories);
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const handleCategoryChange = (event: any, newValue: string | null) => {
        setSelectedCategory(newValue);
        if (newValue) {
            setFilters({ ...filterValues, 'categories.name': newValue }, {});
        } else {
            const { ['categories.name']: categoryName, ...restFilters } = filterValues;
            setFilters(restFilters, {});
        }
    };

    return (
        <Autocomplete
            sx={{ minWidth: 200 }}
            size="small"
            options={category.map(categori => categori.name)}
            loading={loading}
            value={selectedCategory}
            onChange={handleCategoryChange}
            renderInput={(params) => (
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

// Keyword search component
const KeywordSearch = () => {
    const { filterValues, setFilters } = useListContext();
    const [searchValue, setSearchValue] = useState('');

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchValue(value);

        if (value) {
            setFilters({ ...filterValues, q: value }, {});
        } else {
            const { q, ...restFilters } = filterValues;
            setFilters(restFilters, {});
        }
    };

    return (
        <MuiTextField
            label="Search"
            variant="outlined"
            size="small"
            value={searchValue}
            onChange={handleSearchChange}
            InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />,
            }}
            sx={{ minWidth: 300 }}
        />
    );
};

// Horizontal filter toolbar component
export const StoryFilterToolbar = () => {
    const [showRejected, setShowRejected] = useState(false);
    const { setFilters, filterValues } = useListContext();

    const handleToggleRejected = (event: React.ChangeEvent<HTMLInputElement>) => {
        setShowRejected(event.target.checked);

        if (event.target.checked) {
            setFilters({ ...filterValues, isAvailable: undefined }, { isAvailable: undefined });
        } else {
            setFilters({ ...filterValues, isAvailable: ['PENDING', 'ACCEPTED'] }, { isAvailable: ['PENDING', 'ACCEPTED'] });
        }
    };

    useEffect(() => {
        if (!showRejected) {
            setFilters({ isAvailable: ['PENDING', 'ACCEPTED'] }, { isAvailable: ['PENDING', 'ACCEPTED'] });
        }
    }, [setFilters, showRejected]);

    return (
        <Paper sx={{ p: 2, mb: 2 }}>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={4}>
                    <KeywordSearch />
                </Grid>
                <Grid item xs={6} sm={3}>
                    <CategoryFilter />
                </Grid>
                <Grid item xs={6} sm={3}>
                    <AuthorFilter />
                </Grid>
                <Grid item xs={12} sm={2}>
                    <Tooltip title="Show rejected stories">
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={showRejected}
                                    onChange={handleToggleRejected}
                                    color="primary"
                                    size="small"
                                />
                            }
                            label="Show Rejected"
                            sx={{ ml: 1 }}
                        />
                    </Tooltip>
                </Grid>
            </Grid>
        </Paper>
    );
};
