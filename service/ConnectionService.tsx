export default async function api<T>({
                                         url,
                                         body,
                                         method = 'GET'
                                     }: {
    url: string,
    body?: string,
    method?: string
}): Promise<T> {
    console.log('url:', url, ' and method:', method);

    let headers: HeadersInit | undefined = {};

    if(process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USERID && process.env.NEXT_PUBLIC_USERID.trim().length > 1){
        headers['x-user-id'] = process.env.NEXT_PUBLIC_USERID;
    }
    if(process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USEREMAIL && process.env.NEXT_PUBLIC_USEREMAIL.trim().length > 1){
        headers['x-user-email'] = process.env.NEXT_PUBLIC_USEREMAIL;
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


