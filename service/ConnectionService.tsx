export default async function api<T>({
                                         url,
                                         body,
                                         method = 'GET',
                                         userId,
                                         userEmail
                                     }: {
    url: string,
    body?: string,
    method?: string,
    userId?: string,
    userEmail?: string
}): Promise<T> {
    console.log('url:', url, ' and method:', method);

    let headers: HeadersInit | undefined = {};

    if (userId && userId.trim().length > 1) {
        headers['x-user-id'] = userId;
    }

    if (userEmail && userEmail.trim().length > 1) {
        headers['x-user-email'] = userEmail;
    }

    return await fetch(url, {
        method: method,
        body: body,
        credentials: 'include',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return response.json() as Promise<T>;
        });
}


