export default async function fetchAllItems(json) {
    console.log(json);
    const res = await fetch(
        process.env.API_ENDPOINT + '/purchase',
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(json)
        }
    );
    if (!res.ok) {
        throw new Error("Failed to fetch item");
    }
    return res.json();
}