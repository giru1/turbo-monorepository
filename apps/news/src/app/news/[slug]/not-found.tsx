import Link from 'next/link';
import { Button, Container, Typography, Box } from '@mui/material';

export default function NotFound() {
    return (
        <Container maxWidth="md">
            <Box
                sx={{
                    minHeight: '60vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center'
                }}
            >
                <Typography variant="h4" component="h1" gutterBottom>
                    Новость не найдена
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                    К сожалению, запрашиваемая новость не существует или была удалена.
                </Typography>
                <Button
                    variant="contained"
                    component={Link}
                    href="/"
                    sx={{ mt: 2 }}
                >
                    Вернуться на главную
                </Button>
            </Box>
        </Container>
    );
}