async function api<T>(url: string, body: string = '', method: string = "GET",): Promise<T> {
    const response = await fetch(url, {
        method,
        body,
        credentials: "include",
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    return await (response.json() as Promise<T>);
}
