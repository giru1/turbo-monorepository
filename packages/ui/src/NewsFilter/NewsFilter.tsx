'use client';
import { Grid } from '@mui/material';


interface NewsProps {
    title: string;
    desc: string;
    link?: string;
    date?: string;
    img?: string;
}

export default function NewsDetail() {

    return (
        <Grid size={{xs: 12, sm: 6, md: 6, lg: 6}}>
            <div className="">
                <ul>
                    <li>1</li>
                    <li>2</li>
                    <li>3</li>
                    <li>4</li>
                    <li>5</li>
                </ul>
            </div>
        </Grid>
    );
}
