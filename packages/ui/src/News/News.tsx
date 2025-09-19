"use client";
import { Grid } from "@mui/material";
import Link from "next/link";

interface NewsProps {
    title: string;
    descSmall: string;
    link?: string;
    date?: string;
    img?: string;
}

export default function News({ title, descSmall, link = "#", date, img }: NewsProps) {
    return (
        <Grid size={{xs: 12, sm: 6, md: 6, lg: 6}}>
            <div className="border rounded-2xl shadow-md overflow-hidden bg-white flex flex-col h-full">
                <div className="h-48 w-full overflow-hidden">
                    <img src={img} alt={title} className="w-full h-full object-cover" />
                </div>
                <div className="p-4 flex flex-col flex-grow">
                    <div className="text-gray-500 text-sm mb-2">{date}</div>
                    <h4 className="text-lg font-semibold mb-2">{title}</h4>
                    <p className="text-gray-700 flex-grow">{descSmall}</p>
                    <Link
                        href={`${link}`}
                        className="mt-4 inline-block text-blue-600 font-medium hover:underline"
                    >
                        Подробнее →
                    </Link>
                </div>
            </div>
        </Grid>
    );
}
