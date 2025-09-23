'use client';
import { Grid, Chip, Box, Typography, Card, CardContent, FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText, Button } from '@mui/material';
import { useState } from 'react';

interface Participant {
    id: string;
    name: string;
    role: string;
    link: string;
}

interface NewsFilterProps {
    onFilterChange: (filters: {
        tags: string[];
        date: string | null;
        participants: string[];
    }) => void;
    allParticipants: Participant[];
    availableDates: string[];
}

const newsTags = [
    'Все новости',
    'Новости',
    'События',
    'Поздравления',
    'Новости подразделений',
    'Акции',
    'Объявления'
];

export default function NewsFilter({ onFilterChange, allParticipants, availableDates }: NewsFilterProps) {
    const [selectedTags, setSelectedTags] = useState<string[]>(['Все новости']);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);

    const handleTagClick = (tag: string) => {
        let newSelectedTags: string[];

        if (tag === 'Все новости') {
            newSelectedTags = ['Все новости'];
            setSelectedDate('');
            setSelectedParticipants([]);
        } else {
            if (selectedTags.includes('Все новости')) {
                newSelectedTags = [tag];
            } else if (selectedTags.includes(tag)) {
                newSelectedTags = selectedTags.filter(t => t !== tag);
                if (newSelectedTags.length === 0) {
                    newSelectedTags = ['Все новости'];
                }
            } else {
                newSelectedTags = [...selectedTags, tag];
            }
        }

        setSelectedTags(newSelectedTags);
        applyFilters(newSelectedTags, selectedDate, selectedParticipants);
    };

    const handleDateChange = (date: string) => {
        const newDate = date === '' ? null : date;
        setSelectedDate(date);
        setSelectedTags(['Все новости']);
        setSelectedParticipants([]);
        applyFilters(['Все новости'], newDate, []);
    };

    const handleParticipantChange = (participantIds: string[]) => {
        setSelectedParticipants(participantIds);
        setSelectedTags(['Все новости']);
        setSelectedDate('');
        applyFilters(['Все новости'], null, participantIds);
    };

    const applyFilters = (tags: string[], date: string | null, participants: string[]) => {
        onFilterChange({
            tags: tags.includes('Все новости') ? [] : tags,
            date,
            participants
        });
    };

    const clearAllFilters = () => {
        setSelectedTags(['Все новости']);
        setSelectedDate('');
        setSelectedParticipants([]);
        onFilterChange({
            tags: [],
            date: null,
            participants: []
        });
    };

    return (
        <Box sx={{ mb: 4 }}>
            <Typography
                variant="h6"
                sx={{
                    mb: 2,
                    fontWeight: 600,
                    color: 'text.primary',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}
            >
                Фильтр новостей
                {(selectedDate || selectedParticipants.length > 0 || (selectedTags.length > 0 && !selectedTags.includes('Все новости'))) && (
                    <Button
                        size="small"
                        onClick={clearAllFilters}
                        sx={{ fontSize: '0.75rem' }}
                    >
                        Сбросить
                    </Button>
                )}
            </Typography>

            {/* Фильтр по тегам */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                        По тегам
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {newsTags.map((tag) => (
                            <Chip
                                key={tag}
                                label={tag}
                                clickable
                                variant={selectedTags.includes(tag) ? 'filled' : 'outlined'}
                                color={selectedTags.includes(tag) ? 'primary' : 'default'}
                                onClick={() => handleTagClick(tag)}
                                sx={{
                                    fontWeight: selectedTags.includes(tag) ? 600 : 400,
                                    transition: 'all 0.2s ease-in-out',
                                    '&:hover': {
                                        transform: 'translateY(-1px)',
                                        boxShadow: 2
                                    }
                                }}
                            />
                        ))}
                    </Box>
                </CardContent>
            </Card>

            {/* Фильтр по дате */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                        По дате
                    </Typography>
                    <FormControl fullWidth size="small">
                        <InputLabel>Выберите дату</InputLabel>
                        <Select
                            value={selectedDate}
                            label="Выберите дату"
                            onChange={(e) => handleDateChange(e.target.value)}
                        >
                            <MenuItem value="">
                                <em>Все даты</em>
                            </MenuItem>
                            {availableDates.map((date) => (
                                <MenuItem key={date} value={date}>
                                    {date}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </CardContent>
            </Card>

            {/* Фильтр по участникам */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                        По участникам
                    </Typography>
                    <FormControl fullWidth size="small">
                        <InputLabel>Выберите участников</InputLabel>
                        <Select
                            multiple
                            value={selectedParticipants}
                            onChange={(e) => handleParticipantChange(e.target.value as string[])}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((participantId) => {
                                        const participant = allParticipants.find(p => p.id === participantId);
                                        return participant ? (
                                            <Chip
                                                key={participantId}
                                                label={participant.name}
                                                size="small"
                                            />
                                        ) : null;
                                    })}
                                </Box>
                            )}
                        >
                            {allParticipants.map((participant) => (
                                <MenuItem key={participant.id} value={participant.id}>
                                    <Checkbox checked={selectedParticipants.indexOf(participant.id) > -1} />
                                    <ListItemText
                                        primary={participant.name}
                                        secondary={participant.role}
                                    />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </CardContent>
            </Card>

            {/* Активные фильтры */}
            {(selectedDate || selectedParticipants.length > 0 || (selectedTags.length > 0 && !selectedTags.includes('Все новости'))) && (
                <Card sx={{ mb: 2 }}>
                    <CardContent>
                        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                            Активные фильтры:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {selectedTags.filter(tag => tag !== 'Все новости').map((tag) => (
                                <Chip
                                    key={tag}
                                    label={`Тег: ${tag}`}
                                    size="small"
                                    onDelete={() => handleTagClick(tag)}
                                />
                            ))}
                            {selectedDate && (
                                <Chip
                                    label={`Дата: ${selectedDate}`}
                                    size="small"
                                    onDelete={() => handleDateChange('')}
                                />
                            )}
                            {selectedParticipants.map((participantId) => {
                                const participant = allParticipants.find(p => p.id === participantId);
                                return participant ? (
                                    <Chip
                                        key={participantId}
                                        label={`Участник: ${participant.name}`}
                                        size="small"
                                        onDelete={() => handleParticipantChange(
                                            selectedParticipants.filter(id => id !== participantId)
                                        )}
                                    />
                                ) : null;
                            })}
                        </Box>
                    </CardContent>
                </Card>
            )}
        </Box>
    );
}