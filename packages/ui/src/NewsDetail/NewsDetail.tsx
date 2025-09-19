"use client";
import { Grid } from "@mui/material";

interface NewsDetailProps {
    title: string;
    desc: string;
    date?: string;
    img?: string;
}

export default function NewsDetail({ title, desc, date, img }: NewsDetailProps) {
    return (
        <Grid size={{xs: 12}}>
            <article className="bg-white rounded-2xl shadow-lg p-6">
                <h1 className="text-2xl font-bold mb-2">{title}</h1>
                <div className="text-gray-500 text-sm mb-4">{date}</div>
                {img && (
                    <div className="mb-6">
                        <img src={img} alt={title} className="w-full rounded-xl object-cover" />
                    </div>
                )}
                <div className="text-gray-800 leading-relaxed">{desc}</div>
            </article>
        </Grid>
    );
}
