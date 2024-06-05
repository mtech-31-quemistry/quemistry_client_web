import {PKCECodeChallenge} from '@/types';

const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || ''
const idpAuthorizeEndpoint = process.env.NEXT_PUBLIC_IDP_AuthorizeEndpoint || ''
const idpTokendpoint = process.env.NEXT_PUBLIC_IDP_AuthorizeEndpoint || ''
const redirectUrl = process.env.NEXT_PUBLIC_RedirectUrl || ''
const AuthSvcUrl = process.env.NEXT_PUBLIC_QUEMISTRY_AUTH_URL || ''

const crypto = require('crypto');

function generateRandomString(length: number):string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  async function generateCodeChallenge(verifier: string):Promise<string> {
    const encoder = new TextEncoder();
    const base64urlEncoded = await crypto.createHash('sha256')
                    .update(encoder.encode(verifier))
                    .digest('base64');

    return base64urlEncoded;
  }

export const GoogleSigninService = {
    signIn(state:string, codeChallenge: string) {

        //window.location.href = `${idpAuthorizeEndpoint}?response_type=code&client_id=${clientId}&state=${state}&code_challenge_method=S256&code_challenge=${codeChallenge}&scope=openid+email&identity_provider=Google&redirect_uri=${redirectUrl}`;
        window.location.href = `${idpAuthorizeEndpoint}?response_type=code&client_id=${clientId}&state=${state}&scope=openid+email&identity_provider=Google&redirect_uri=${redirectUrl}`;
    },
    generateRandomBytes():string {
        const rand = crypto.randomBytes(8).toString('hex');
        return rand;
    },
    async generateCodeChallenge():PKCECodeChallenge{
        const code_verifier = generateRandomString(128);
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

        fetch(idpTokendpoint, 
            { 
                headers: {'Content-Type': 'application/x-www-form-urlencoded' },
                method: 'POST',
                body: formData
            })
            .then((res) => {
                console.log(res)
                //console.log("result:",res.json())
                if(res.ok){
                    res.json()
                        .then((response)=>{
                            console.log("Login successful");
                        });
                    return true;
                }
                else
                {
                    return false;
                }
            })
            .catch((err) => {
                console.log("getAccessToken", err);
                return false;
        });
    },
    getAuthenticated(codeVerifier: string, authCode: string | any){

        fetch(AuthSvcUrl, { 
                headers: {'Content-Type': 'application/json' },
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
                    res.json()
                        .then((response)=>{
                            console.log(response);
                        });
                }
            })
            .catch((err) => {
                console.log("getAccessToken", err);
            });
    }
};
