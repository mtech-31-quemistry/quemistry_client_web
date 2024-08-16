/* eslint-disable @next/next/no-img-element */
'use client';
import React, { Suspense, useContext, useEffect, useState } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import { AppMenuItem } from '@/types';
import { IS_LOGIN, USER } from '../lib/constants'

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const [user, setUser] = useState<UserProfile | null>();
    const [isLogin, setIsLogin] = useState<boolean>(false);

    useEffect(()=>{
        console.log("session login:", sessionStorage.getItem(IS_LOGIN));
        if(sessionStorage != undefined){
            console.log("set login:",(sessionStorage.getItem(IS_LOGIN) == "true"));
            if(sessionStorage.getItem(IS_LOGIN) == "true"){
                setIsLogin(true);
                console.log("session store",sessionStorage.getItem(USER));
                setUser(JSON.parse(sessionStorage.getItem(USER) || '') as UserProfile);
            }else{
                setUser(null);
            }
        }else{
            setIsLogin(false);
        }
    },[]);

    const accessibleBy = (roles: string[]) => {
        //if(process.env.NODE_ENV === 'development') return true;
        console.log(roles);
        console.log("user role:", user?.roles);
        return isLogin && user?.roles.some(role => roles.includes(role));
    }
    //customise list of menu items for quemistry
    const model: AppMenuItem[] = [
        {
            label: 'Home',
            items: [
                { label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/dashboard' },
                { label: 'Take Quiz', icon: 'pi pi-fw pi-pencil', to: '/quiz', visible: accessibleBy(['student']) }
            ]
        },
        {
            label: 'Manage',
            items: [{ label: 'Questions', icon: 'pi pi-fw pi-question-circle', to: '/questions/searchlist', 
                    visible: accessibleBy(['admin', 'tutor']) },
                { label: 'Topics', icon: 'pi pi-fw pi-tags', to: '/questions/topics', visible: accessibleBy(['admin', 'tutor']) },
                { label: 'Classes', icon: 'pi pi-fw pi-sitemap', to: '/classes', visible: accessibleBy(['tutor']) },
            ],
            visible: accessibleBy(['admin', 'tutor'])
        },
    ];

    return (
        <Suspense>
            <MenuProvider>
                <ul className="layout-menu">
                    {model.map((item, i) => {
                        return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                    })}
                </ul>
            </MenuProvider>
        </Suspense>

    );
};

export default AppMenu;
