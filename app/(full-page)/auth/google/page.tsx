'use client'

import { useSearchParams } from 'next/navigation'
import { useCookies} from 'react-cookie'
import  { redirect } from 'next/navigation'
import { GoogleSigninService } from '@/service/GoogleSignInService'
import { useEffect, useState } from 'react'
import { IS_LOGIN } from '../../../../lib/constants'

const GoogleAuthPage = () => {
    const searchParams = useSearchParams()

    const state = searchParams.get("state");
    const authCode = searchParams.get("code");
    const [cookies, setCookies, removeCookie] = useCookies(['state', 'code_verifier']);
    const clientState = cookies.state;
    const codeVerifier = cookies.code_verifier; 
    const [isDenyAccess, setIsDenyAccess] = useState(false);
    const [isLogin, setIsLogin] = useState(false);

    useEffect(()=>{
        if(isDenyAccess)
            redirect('/auth/access');
        if(isLogin)
            redirect('/dashboard');
    },[isDenyAccess, isLogin])

    useEffect(() => {
        //console.debug(`client state ${clientState} received state ${state}`);
        //console.debug(clientState != state);
        //console.debug("authorisation code", authCode);
        //console.debug("code verifier", codeVerifier);

        if(clientState != state || !authCode){
            console.log('redirection');
            setIsDenyAccess(true);
        }

        GoogleSigninService.getAuthenticated(codeVerifier, authCode)
            .then((data) => {
                console.log(data);
                //clear cookies
                removeCookie('state');
                removeCookie('code_verifier');
                localStorage.setItem(IS_LOGIN, "true" );
                setIsLogin(true);
            })
            .catch((err) => {
                console.log("getAccessToken", err);
                setIsDenyAccess(true);
            })
    },[])

    return (<div>
                <p>Loading</p>
            </div>);
}

export default GoogleAuthPage;