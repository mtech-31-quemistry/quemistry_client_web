'use client';
import { USER, IS_LOGIN } from '../lib/constants'

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
    apply(path: string):boolean{
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
            case '/dashboard':
                return true;
            case '/quiz':
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
            default:
                return false;
        }
    },
    accessibleBy (roles: string[]) {
        return this.isLogin() && this.loginUser()?.roles.some(role => roles.includes(role)) || false;
    },
    
}