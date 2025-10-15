'use client';
import { Box, Typography, Chip, Card, CardContent } from '@mui/material';
import Link from 'next/link';
import { Author } from '@/types/news';

interface NewsSidebarProps {
    authors: Author[];
    date: string;
    originalDate?: string;
    tags: string[];
    currentSlug: string;
}

export default function NewsSidebar({ authors, date, originalDate, tags }: NewsSidebarProps) {
    // Функция для получения даты в правильном формате для URL
    const getDateForUrl = (): string => {
        if (originalDate) {
            return new Date(originalDate).toISOString().split('T')[0];
        }

        // Пытаемся распарсить отформатированную дату
        try {
            const dateParts = date.split(' ');
            if (dateParts.length === 3) {
                const day = parseInt(dateParts[0]);
                const month = getMonthNumber(dateParts[1]);
                const year = parseInt(dateParts[2]);

                if (month !== -1) {
                    const dateObj = new Date(year, month, day);
                    return dateObj.toISOString().split('T')[0];
                }
            }
        } catch (error) {
            console.error('Ошибка парсинга даты:', error);
        }

        return new Date().toISOString().split('T')[0];
    };

    // Функция для конвертации названия месяца в число
    const getMonthNumber = (monthName: string): number => {
        const months: { [key: string]: number } = {
            'января': 0, 'февраля': 1, 'марта': 2, 'апреля': 3,
            'мая': 4, 'июня': 5, 'июля': 6, 'августа': 7,
            'сентября': 8, 'октября': 9, 'ноября': 10, 'декабря': 11
        };
        return months[monthName.toLowerCase()] ?? -1;
    };

    const dateForUrl = getDateForUrl();

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
                                component={Link}
                                href={`/?author=${encodeURIComponent(author.name)}`}
                                sx={{ mb: 1, textDecoration: 'none' }}
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
                        component={Link}
                        href={`/?date=${dateForUrl}`}
                        sx={{ textDecoration: 'none' }}
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
                                component={Link}
                                href={`/news?tag=${encodeURIComponent(tag)}`}
                                sx={{ mb: 1, textDecoration: 'none' }}
                            />
                        ))}
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}