"use client";
import {
    Grid,
    Paper,
    Typography,
    Box,
    Chip,
    Avatar,
    AvatarGroup,
    useTheme,
    useMediaQuery
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import {
    CalendarToday,
    Person,
    LocalOffer
} from "@mui/icons-material";
import React from "react";
import { NewsItem, Author, Tag, Category, NewsDetailProps } from "@/types/news";


const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    borderRadius: theme.spacing(3),
    boxShadow: theme.shadows[8],
    background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 4,
        background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    }
}));

const TitleTypography = styled(Typography)(({ theme }) => ({
    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    fontWeight: 700,
    lineHeight: 1.2,
    marginBottom: theme.spacing(2),
}));

const DateBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(3),
    padding: theme.spacing(1, 2),
    backgroundColor: theme.palette.action.hover,
    borderRadius: theme.spacing(2),
    width: 'fit-content',
}));

const ImageContainer = styled(Box)(({ theme }) => ({
    borderRadius: theme.spacing(2),
    overflow: 'hidden',
    marginBottom: theme.spacing(4),
    boxShadow: theme.shadows[4],
    '& img': {
        width: '100%',
        height: '400px',
        objectFit: 'cover',
    }
}));

const CarouselImage = styled('img')({
    width: '100%',
    height: '400px',
    objectFit: 'cover',
});

const DescriptionText = styled(Typography)(({ theme }) => ({
    lineHeight: 1.8,
    color: theme.palette.text.primary,
    fontSize: '1.1rem',
    whiteSpace: 'pre-line',
}));

const TagChip = styled(Chip)(({ theme }) => ({
    margin: theme.spacing(0.5),
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
    fontWeight: 600,
}));

export default function NewsDetail({
                                       title,
                                       desc,
                                       date,
                                       image,
                                       imageurl,
                                       gallery= [],
                                       authors = [],
                                       tags = []
                                   }: NewsDetailProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // Если есть дополнительные изображения, используем их вместе с основным
    const allImages = imageurl ? [imageurl, ...gallery] : gallery;


    return (
        <Grid container justifyContent="center">
            <Grid size={{xs: 12, md: 12, lg: 12}}>
                <StyledPaper elevation={0}>
                    {/* Заголовок */}
                    <TitleTypography variant={isMobile ? "h4" : "h3"} gutterBottom>
                        {title}
                    </TitleTypography>

                    {/* Дата */}
                    {date && (
                        <DateBox>
                            <CalendarToday fontSize="small" />
                            <Typography variant="subtitle1" fontWeight="500">
                                {date}
                            </Typography>
                        </DateBox>
                    )}

                    {/* Слайдер изображений */}
                    {allImages.length > 0 && (
                        <ImageContainer>
                            {allImages.length > 1 ? (
                                <Carousel
                                    showArrows={true}
                                    showThumbs={false}
                                    showStatus={false}
                                    infiniteLoop={true}
                                    autoPlay={true}
                                    interval={5000}
                                >
                                    {allImages.map((image, index) => (
                                        <div key={index}>
                                            <CarouselImage
                                                src={image}
                                                alt={`${title} - изображение ${index + 1}`}
                                            />
                                        </div>
                                    ))}
                                </Carousel>
                            ) : (
                                <img
                                    src={allImages[0]}
                                    alt={title}
                                />
                            )}
                        </ImageContainer>
                    )}

                    {/* Авторы */}
                    {authors.length > 0 && (
                        <Box display="flex" alignItems="center" gap={2} mb={3}>
                            {/*<Person color="action" />*/}
                            <AvatarGroup max={4}>
                                {authors.map((author: Author) => {
                                    const initials = author.name
                                        .split(" ")
                                        .map((w: string) => w[0])
                                        .join(""); // Например, "ИИ" для "Иванов Иван"

                                    return (
                                        <Box key={author.id} display="flex" alignItems="center" gap={1}>
                                            <Avatar alt={author.name}>{initials}</Avatar>
                                            <Typography variant="body2" color="text.secondary">
                                                {author.name}
                                            </Typography>
                                        </Box>
                                    );
                                })}
                            </AvatarGroup>

                        </Box>
                    )}

                    {/* Описание */}
                    <DescriptionText variant="body1" paragraph>
                        {desc}
                    </DescriptionText>

                    {/* Теги */}
                    {tags.length > 0 && (
                        <Box mt={4}>
                            <Box display="flex" alignItems="center" gap={1} mb={2}>
                                <LocalOffer fontSize="small" color="action" />
                                <Typography variant="h6" fontWeight="600">
                                    Теги:
                                </Typography>
                            </Box>
                            <Box display="flex" flexWrap="wrap">
                                {tags.map((tag, index) => (
                                    <TagChip
                                        key={index}
                                        label={tag}
                                        size="small"
                                    />
                                ))}
                            </Box>
                        </Box>
                    )}
                </StyledPaper>
            </Grid>
        </Grid>
    );
}