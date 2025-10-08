'use client';
import { Box, Typography, Chip, Card, CardContent, Link } from '@mui/material';
import { Author } from '@/types/news';

interface NewsSidebarProps {
    authors: Author[];
    date: string;
    tags: string[];
    currentSlug: string;
}

export default function NewsSidebar({ authors, date, tags, currentSlug }: NewsSidebarProps) {
    const handleParticipantClick = (authorId: string) => {
        // Переход на страницу с новостями по участнику
        window.location.href = `?author=${authorId}`;
    };

    const handleDateClick = () => {
        // Переход на страницу с новостями за эту дату
        window.location.href = `?date=${encodeURIComponent(date)}`;
    };

    const handleTagClick = (tag: string) => {
        // Переход на страницу с новостями по тегу
        window.location.href = `?tag=${encodeURIComponent(tag)}`;
    };

    return (
        <Box sx={{ position: 'sticky', top: 100 }}>
            {/* Фильтр по участникам */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Участники новости
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {authors.map((author) => (
                            <Chip
                                key={author.id}
                                label={author.name}
                                variant="outlined"
                                clickable
                                onClick={() => handleParticipantClick(author.name)}
                                sx={{ mb: 1 }}
                            />
                        ))}
                    </Box>
                </CardContent>
            </Card>

            {/* Фильтр по дате */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Дата публикации
                    </Typography>
                    <Chip
                        label={date}
                        variant="outlined"
                        clickable
                        onClick={handleDateClick}
                    />
                </CardContent>
            </Card>

            {/* Фильтр по тегам */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Теги новости
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {tags.map((tag, index) => (
                            <Chip
                                key={index}
                                label={tag}
                                variant="outlined"
                                clickable
                                onClick={() => handleTagClick(tag)}
                                sx={{ mb: 1 }}
                            />
                        ))}
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}