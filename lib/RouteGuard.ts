'use client';
import { USER, IS_LOGIN } from '@/lib/constants'

let queryParameters = '';
export const RouteGuard = {

    isLogin(){
        if(typeof sessionStorage !== "undefined"){
            return sessionStorage?.getItem(IS_LOGIN) == "true" || false;
        }
        else{
            return false;
        }
    },
    loginUser(){
        if(this.isLogin()){
            return  JSON.parse(sessionStorage.getItem(USER) || '') as UserProfile;
        }
        else{
            return null;
        }
    },
    apply(path: string, queryString: string):boolean{
        queryParameters = path + "?" + queryString;
        if(process.env.NODE_ENV === 'development') return true;
        switch(path){
            case '/':
                return true;
            case '/auth/google':
                return true;
            case '/auth/access':
                return true;
            case '/auth/error':
                return true;
            case '/quiz':
                return this.accessibleBy(['student']);
            case '/test':
                return this.accessibleBy(['student']);
            case '/quiz/history':
                return this.accessibleBy(['student']);
            case '/quiz/results':
                return this.accessibleBy(['student']);
            case '/questions/create':
                return this.accessibleBy(['admin', 'tutor']);
            case '/questions/edit':
                return this.accessibleBy(['admin', 'tutor']);
            case '/questions/searchlist':
                return this.accessibleBy(['admin', 'tutor']);
            case '/questions/topics':
                return this.accessibleBy(['admin', 'tutor']);
            case '/classes':
                return this.accessibleBy(['admin', 'tutor']);
            case '/genai':
                return this.accessibleBy(['admin', 'tutor']);
            default:
                return false;
        }
    },
    accessibleBy (roles: string[]): boolean {
        var canAccess = this.isLogin() && this.loginUser()?.roles.some(role => roles.includes(role)) || false;

        if (!canAccess) {
            sessionStorage.setItem("redirection",  queryParameters);
        }

        return canAccess;
    },

}

export default RouteGuard;
