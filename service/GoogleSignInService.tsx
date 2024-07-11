import {PKCECodeChallenge} from '@/types';
import { IS_LOGIN } from '../lib/constants'

const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || ''
const idpAuthorizeEndpoint = process.env.NEXT_PUBLIC_IDP_AuthorizeEndpoint || ''
const idpTokendpoint = process.env.NEXT_PUBLIC_IDP_AuthorizeEndpoint || ''
const redirectUrl = process.env.NEXT_PUBLIC_RedirectUrl || ''
const AuthSvcUrl = process.env.NEXT_PUBLIC_QUEMISTRY_AUTH_URL || ''

const crypto = require('crypto');

function generateRandomString():string {
    var array = new Uint32Array(56 / 2);
    window.crypto.getRandomValues(array);
    return Array.from(array, (value)=>{return ("0" + value.toString(16)).substr(-2);}).join("");
  }

  async function generateCodeChallenge(verifier: string):Promise<string> {
    const encoder = new TextEncoder();
    const base64urlEncoded = await crypto.createHash('sha256')
                    .update(encoder.encode(verifier))
                    .digest('base64')
                    .replace(/\+/g, "-")
                    .replace(/\//g, "_")
                    .replace(/=+$/, "");

    return base64urlEncoded;
  }

export const GoogleSigninService = {
    signIn(state:string, codeChallenge: string) {

        window.location.href = `${idpAuthorizeEndpoint}?response_type=code&client_id=${clientId}&state=${state}&code_challenge_method=S256&code_challenge=${codeChallenge}&scope=openid+email&identity_provider=Google&redirect_uri=${redirectUrl}`;
        //window.location.href = `${idpAuthorizeEndpoint}?response_type=code&client_id=${clientId}&state=${state}&scope=openid+email&identity_provider=Google&redirect_uri=${redirectUrl}`;
    },
    generateRandomBytes():string {
        const rand = crypto.randomBytes(8).toString('hex');
        return rand;
    },
    async generateCodeChallenge():PKCECodeChallenge{
        const code_verifier = generateRandomString();
        const code_challenge = await generateCodeChallenge(code_verifier);
        
        return { codeVerifier: code_verifier, codeChallenge: code_challenge}
    },
    //not in used
    getAccessToken(codeVerifier: string, authCode: string | any){
        let formData = new URLSearchParams({
            'grant_type':'authorization_code',
            'redirect_uri':redirectUrl,
            'client_id':clientId,
            'code':authCode,
            'code_verifier':codeVerifier,
            'scope': 'email openid profile'
        });

        return fetch(idpTokendpoint, 
            { 
                headers: {'Content-Type': 'application/x-www-form-urlencoded' },
                method: 'POST',
                body: formData
            })
            .then((res) => {
                if(res.ok){
                    return res.json() //contains access tokens
                }
                else
                {
                    throw new Error(res.status + " at signing with google account.")
                }
            })
            .then((d) => d);
    },
    getAuthenticated(codeVerifier: string, authCode: string | any){

        return fetch(AuthSvcUrl, { 
                headers: {'Content-Type': 'application/json' },
                credentials: "include",
                method: 'POST',
                body: JSON.stringify({
                    codeVerifier: codeVerifier,
                    authCode: authCode,
                    redirectUrl: redirectUrl,
                    clientId: clientId
                })
            })
            .then((res) => {
                if(res.ok){
                    localStorage.setItem(IS_LOGIN, "true" );
                    return res.json()
                }
                else
                {
                    throw new Error(res.status + " at signing with google account.")
                }
            })
            .then((d) => d as UserProfile);;
    },
    signOut(){
        return fetch(AuthSvcUrl+'/signout',{
            headers: {'Content-Type': 'application/json' }, 
            credentials: 'include',
            method: 'POST',
            body: JSON.stringify({
                clientId: clientId
            })
        })
        .then((res)=>{
            if(res.ok){
                localStorage.setItem(IS_LOGIN, "false" );
                return;
            }
            else
            {
                localStorage.setItem(IS_LOGIN, "false" );
                throw new Error(res.status + " at signing out.")
            }
        })
    }
};
