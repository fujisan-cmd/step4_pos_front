export default async function fetchItem(code) {
    const res = await fetch(
        process.env.API_ENDPOINT + `/search_prod_info?code=${code}`, 
        { cache: "no-cache" }
    );
    if (!res.ok) {
        throw new Error("Failed to fetch item");
    }
    return res.json();
}