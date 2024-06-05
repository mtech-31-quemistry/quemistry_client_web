'use client'

import { useSearchParams } from 'next/navigation'
import { useCookies } from 'react-cookie'
import  { redirect } from 'next/navigation'
import { GoogleSigninService } from '@/service/GoogleSignInService'
import { useEffect } from 'react'

const GoogleAuthPage = () => {
    const searchParams = useSearchParams()

    const state = searchParams.get("state");
    const authCode = searchParams.get("code");
    const [cookies, setCookies] = useCookies(['state', 'code_verifier']);
    const clientState = cookies.state;
    const codeVerifier = cookies.code_verifier; 

    useEffect(() => {
        console.debug(`client state ${clientState} received state ${state}`);
        console.debug(clientState != state);
        console.debug("authorisation code", authCode);
        console.debug("code verifier", codeVerifier);

        if(clientState != state || !authCode){
            console.log('redirection');
            //redirect('/auth/access');
        }
        GoogleSigninService.getAuthenticated(codeVerifier, authCode)
    },[])

    return (<div>
                <p>Google Response Success</p>
            </div>);
}

export default GoogleAuthPage;