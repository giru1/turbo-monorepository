// apps/it/src/lib/api.ts
export async function fetchAPI(path: string) {
    const res = await fetch(`http://localhost:1337/api${path}?populate=*`, {
        headers: { 'Content-Type': 'application/json' },
        cache: "no-store" // чтобы данные всегда были свежими
    });

    if (!res.ok) {
        console.error(`Ошибка Strapi: ${res.statusText}`);
        throw new Error(`Ошибка Strapi: ${res.statusText}`);
    }

    return res.json();
}
