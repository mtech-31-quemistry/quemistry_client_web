export const ApiHelper = {

    getRequestHeaders() {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        if(process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USERID && process.env.NEXT_PUBLIC_USERID.trim().length > 1){
          headers.append('x-user-id', process.env.NEXT_PUBLIC_USERID);
        }
        if(process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USEREMAIL && process.env.NEXT_PUBLIC_USEREMAIL.trim().length > 1){
          headers.append('x-user-email', process.env.NEXT_PUBLIC_USEREMAIL);
        }
        return headers;
    },
}

export default ApiHelper;