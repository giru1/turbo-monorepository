'use client';
import { Suspense } from 'react';

import { Container, Typography } from "@mui/material";
import NewsListContent from "@/components/NewsListContent/NewsListContent"; // Импортируем новый компонент

// Главный компонент с Suspense
export default function NewsListPage() {
    return (
        <Suspense fallback={
            <Container maxWidth="xl" sx={{ marginBottom: 4, marginTop: 4 }}>
                <Typography variant="h6">Загрузка...</Typography>
            </Container>
        }>
            <NewsListContent />
        </Suspense>
    );
}