function api<T>(url: string, body: string = '', method: string = "GET",): Promise<T> {
    return fetch(url, {
        method: method,
        body: body,
        credentials: "include",
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(response.statusText)
            }
            return response.json() as Promise<T>
        });
}
