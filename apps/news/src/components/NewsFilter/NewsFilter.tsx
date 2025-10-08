// src/components/NewsFilter/NewsFilter.tsx
import React, { useState } from 'react';
import {
    Box,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    OutlinedInput,
    SelectChangeEvent,
    Button,
    Popover
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ru } from 'date-fns/locale';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

interface NewsFilterProps {
    onFilterChange: (filters: {
        category?: string;
        tag?: string;
        author?: string;
        date?: string;
        dateRange?: { start: Date | null; end: Date | null };
    }) => void;
    categories: any[];
    availableTags: string[];
    availableAuthors: string[];
    availableDates: string[];
    currentFilters: {
        category: string;
        tag: string;
        author: string;
    };
}

const NewsFilter: React.FC<NewsFilterProps> = ({
                                                   onFilterChange,
                                                   categories,
                                                   availableTags,
                                                   availableAuthors,
                                                   availableDates,
                                                   currentFilters
                                               }) => {
    const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({
        start: null,
        end: null
    });
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const handleCategoryChange = (event: SelectChangeEvent<string>) => {
        onFilterChange({
            ...currentFilters,
            category: event.target.value,
            dateRange: dateRange.start && dateRange.end ? dateRange : undefined
        });
    };

    const handleTagChange = (event: SelectChangeEvent<string>) => {
        onFilterChange({
            ...currentFilters,
            tag: event.target.value,
            dateRange: dateRange.start && dateRange.end ? dateRange : undefined
        });
    };

    const handleAuthorChange = (event: SelectChangeEvent<string>) => {
        onFilterChange({
            ...currentFilters,
            author: event.target.value,
            dateRange: dateRange.start && dateRange.end ? dateRange : undefined
        });
    };

    const handleDateRangeChange = (type: 'start' | 'end', value: Date | null) => {
        const newDateRange = {
            ...dateRange,
            [type]: value
        };
        setDateRange(newDateRange);

        // Если обе даты выбраны, применяем фильтр
        if (newDateRange.start && newDateRange.end) {
            onFilterChange({
                ...currentFilters,
                date: '', // Очищаем старый фильтр по дате
                dateRange: newDateRange
            });
        }
    };

    const handleCalendarOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCalendarClose = () => {
        setAnchorEl(null);
    };

    const clearDateRange = () => {
        setDateRange({ start: null, end: null });
        onFilterChange({
            ...currentFilters,
            date: '',
            dateRange: undefined
        });
    };

    const formatDateRangeDisplay = () => {
        if (dateRange.start && dateRange.end) {
            return `${dateRange.start.toLocaleDateString('ru-RU')} - ${dateRange.end.toLocaleDateString('ru-RU')}`;
        }
        return 'Выберите период';
    };

    const open = Boolean(anchorEl);
    const id = open ? 'date-range-popover' : undefined;

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
            <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                <Typography variant="h6" gutterBottom>
                    Фильтры
                </Typography>

                {/* Категория */}
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Категория</InputLabel>
                    <Select
                        value={currentFilters.category}
                        onChange={handleCategoryChange}
                        input={<OutlinedInput label="Категория" />}
                    >
                        <MenuItem value="">Все категории</MenuItem>
                        {categories
                            .filter(category => category?.alias)
                            .map((category) => (
                                <MenuItem key={category.id} value={category.alias}>
                                    {category.name}
                                </MenuItem>
                            ))}
                    </Select>
                </FormControl>

                {/* Теги */}
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Тег</InputLabel>
                    <Select
                        value={currentFilters.tag}
                        onChange={handleTagChange}
                        input={<OutlinedInput label="Тег" />}
                    >
                        <MenuItem value="">Все теги</MenuItem>
                        {availableTags.map((tag) => (
                            <MenuItem key={tag} value={tag}>
                                {tag}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Автор */}
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Автор</InputLabel>
                    <Select
                        value={currentFilters.author}
                        onChange={handleAuthorChange}
                        input={<OutlinedInput label="Автор" />}
                    >
                        <MenuItem value="">Все авторы</MenuItem>
                        {availableAuthors.map((author) => (
                            <MenuItem key={author} value={author}>
                                {author}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Календарь с диапазоном дат */}
                <Box sx={{ mb: 2 }}>
                    <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<CalendarTodayIcon />}
                        onClick={handleCalendarOpen}
                        aria-describedby={id}
                    >
                        {formatDateRangeDisplay()}
                    </Button>

                    {dateRange.start && dateRange.end && (
                        <Button
                            size="small"
                            onClick={clearDateRange}
                            sx={{ mt: 1 }}
                        >
                            Очистить даты
                        </Button>
                    )}

                    <Popover
                        id={id}
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleCalendarClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                    >
                        <Box sx={{ p: 2, minWidth: 300 }}>
                            <Typography variant="subtitle1" gutterBottom>
                                Выберите период
                            </Typography>

                            <DatePicker
                                label="Начальная дата"
                                value={dateRange.start}
                                onChange={(date) => handleDateRangeChange('start', date)}
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        margin: 'normal'
                                    }
                                }}
                            />

                            <DatePicker
                                label="Конечная дата"
                                value={dateRange.end}
                                onChange={(date) => handleDateRangeChange('end', date)}
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        margin: 'normal'
                                    }
                                }}
                            />

                            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    onClick={() => {
                                        const today = new Date();
                                        const weekAgo = new Date();
                                        weekAgo.setDate(today.getDate() - 7);
                                        setDateRange({ start: weekAgo, end: today });
                                    }}
                                >
                                    Неделя
                                </Button>

                                <Button
                                    variant="outlined"
                                    fullWidth
                                    onClick={() => {
                                        const today = new Date();
                                        const monthAgo = new Date();
                                        monthAgo.setMonth(today.getMonth() - 1);
                                        setDateRange({ start: monthAgo, end: today });
                                    }}
                                >
                                    Месяц
                                </Button>
                            </Box>
                        </Box>
                    </Popover>
                </Box>

                {/* Отображение активных фильтров */}
                <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                        Активные фильтры:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {currentFilters.category && (
                            <Chip
                                label={`Категория: ${categories.find(c => c.alias === currentFilters.category)?.name}`}
                                onDelete={() => onFilterChange({ ...currentFilters, category: '' })}
                                size="small"
                            />
                        )}
                        {currentFilters.tag && (
                            <Chip
                                label={`Тег: ${currentFilters.tag}`}
                                onDelete={() => onFilterChange({ ...currentFilters, tag: '' })}
                                size="small"
                            />
                        )}
                        {currentFilters.author && (
                            <Chip
                                label={`Автор: ${currentFilters.author}`}
                                onDelete={() => onFilterChange({ ...currentFilters, author: '' })}
                                size="small"
                            />
                        )}
                        {dateRange.start && dateRange.end && (
                            <Chip
                                label={`Период: ${formatDateRangeDisplay()}`}
                                onDelete={clearDateRange}
                                size="small"
                            />
                        )}
                        {currentFilters.date && !dateRange.start && !dateRange.end && (
                            <Chip
                                label={`Дата: ${currentFilters.date}`}
                                onDelete={() => onFilterChange({ ...currentFilters, date: '' })}
                                size="small"
                            />
                        )}
                    </Box>
                </Box>
            </Box>
        </LocalizationProvider>
    );
};

export default NewsFilter;