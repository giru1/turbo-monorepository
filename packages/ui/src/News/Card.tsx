'use client';
import { Grid, Button } from '@mui/material';
import styles from './Card.module.css';


interface CardProps {
    title: string;
    description: string;
    link?: string;         // ссылка для всей карточки
    buttonLink?: string;   // ссылка для кнопки
    buttonText?: string;
    widgetUrl?: string;    // URL виджета
}

// // Динамический импорт виджета (только на клиенте)
// const WidgetMiBase = dynamic(() => import('./WidgetMiBase'), { ssr: false });

export default function Card({ title, description, link, buttonLink, buttonText, widgetUrl }: CardProps) {
    const CardContent = (
        <div className={styles.card}>
            <div className={styles.card__title}>{title}</div>
            <div className={styles.card__bottom}>
                <div className={styles.card__line}></div>
                <div className={styles.card__desc}>{description}</div>

                {buttonLink && (
                    <a href={buttonLink} className={styles.card__button_link} target="_blank" rel="noopener noreferrer">
                        <Button variant="contained" className={styles.card__button}>
                            {buttonText || "Подробнее"}
                        </Button>
                    </a>
                )}
                {widgetUrl && <div id="widgetMiBase" className="widget-mi-base" data-url="defaultSettings.json"></div>}
            </div>
        </div>
    );

    return (
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
            {link ? (
                <a href={link} style={{ textDecoration: 'none', color: 'inherit' }}>
                    {CardContent}
                </a>
            ) : (
                CardContent
            )}
        </Grid>
    );
}
