'use client';
import { Grid } from '@mui/material';
import styles from './News.module.css';

interface NewsProps {
    title: string;
    descSmall: string;
    link?: string;
    date?: string;
    img?: string;
}

export default function News({title, descSmall, link, date, img}:NewsProps) {

    return (
        <Grid size={{xs: 12, sm: 6, md: 6, lg: 6}}>
            <div className="news">
                <div className="news-item">
                    <div className="news-item-image">
                        <img src={img} alt="Логотип" className={styles.header__logo_img}/>
                    </div>
                    <div className="news-item-content">
                        <div className="news-item-date">{date}</div>
                        <h4 className="news-item-title">{title}</h4>
                        <div className="news-item-excerpt">{descSmall}</div>
                        <a href={link} className="news-item-link">Подробнее →</a>
                    </div>
                </div>
            </div>
        </Grid>
    );
}
