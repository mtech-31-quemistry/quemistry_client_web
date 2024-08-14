'use client'

import { useSearchParams } from 'next/navigation'
import { useCookies} from 'react-cookie'
import  { redirect } from 'next/navigation'
import { GoogleSigninService } from '@/service/GoogleSignInService'
import { useContext , useEffect, useState } from 'react'
import { LayoutContext } from '../../../../layout/context/layoutcontext';
import { classNames } from 'primereact/utils';
import { Button } from 'primereact/button';

const GoogleAuthPage = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const searchParams = useSearchParams()
    const [cookies, setCookies, removeCookie] = useCookies(['state', 'code_verifier']);
    const clientState = cookies.state;
    const codeVerifier = cookies.code_verifier; 
    const [isDenyAccess, setIsDenyAccess] = useState(false);
    const [isLogin, setIsLogin] = useState(false);
    const state = searchParams.get("state");
    const authCode = searchParams.get("code");

    useEffect(()=>{
        if(isDenyAccess)
            redirect('/auth/access');
        if(isLogin)
            redirect('/dashboard');
    },[isDenyAccess, isLogin])

    useEffect(() => {
          if(state !== null || authCode !== null){
            if(clientState != state || !authCode){
                console.log('redirection');
                setIsDenyAccess(true);
            }

            GoogleSigninService.getAuthenticated(codeVerifier, authCode)
                .then((data) => {
                    //clear cookies
                    removeCookie('state');
                    removeCookie('code_verifier');
                    setIsLogin(true);
                })
                .catch((err) => {
                    console.log("getAccessToken", err);
                    setIsDenyAccess(true);
                })
        }
    },[])
    async function signIn() {
        var state = GoogleSigninService.generateRandomBytes();
        
        await GoogleSigninService.generateCodeChallenge()
            .then((result:any)=>{
                setCookies('code_verifier', result.codeVerifier, {
                    httpOnly: false,
                    secure: false,
                    maxAge: 60, //60 secs
                    path: '/'
                });
                setCookies('state', state, {
                    httpOnly: false,
                    secure: false,
                    maxAge: 60, //60 secs
                    path: '/'
                });    
                GoogleSigninService.signIn(state, result.codeChallenge);   
            });
    }
    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

    return (
        <div className={containerClassName}>
            <div className="flex flex-column align-items-center justify-content-center">
                <img src={`/layout/images/logo-${layoutConfig.colorScheme === 'light' ? 'dark' : 'white'}.png`} alt="Quemistry logo" className="mb-5 w-6rem flex-shrink-0" />
                <div
                    style={{
                        borderRadius: '56px',
                        padding: '0.3rem',
                        background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)'
                    }}
                >
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                        <div className="text-center mb-5">
                            <span className="text-600 font-medium">Sign in to continue</span>
                        </div>
                      
                        <div className="flex gap-2 justify-content-center">
                            <Button className="align-items-center" raised onClick={signIn}>
                                <span className="flex align-items-center">
                                    <i className="pi pi-google" style={{ fontSize: '1.5rem' }}></i>
                                </span>
                                <span className="flex align-items-center text-white" style={{ fontSize: '1.5rem' }}>oogle</span>
                            </Button>
                         </div>                    
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GoogleAuthPage;