export default async function api<T>(url: string, body: string = '', method: string = 'GET', header: Header = { userId: '', userEmail: '' }): Promise<T> {
    console.log('url:', url, ' and method:', method);
    return await fetch(url, {
        method: method,
        body: body,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'x-user-id': header.userId,
            'x-user-email': header.userEmail
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return response.json() as Promise<T>;
        });
}

interface Header {
    userId: string;
    userEmail: string;
}
