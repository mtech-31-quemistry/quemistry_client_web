/* eslint-disable @next/next/no-img-element */
'use client';
import React, { Suspense, useContext, useEffect, useState } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import { AppMenuItem } from '@/types';
import { IS_LOGIN, USER } from '../lib/constants';

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const [user, setUser] = useState<UserProfile | null>();
    const [isLogin, setIsLogin] = useState<boolean>(false);

    useEffect(() => {
        if (sessionStorage != undefined) {
            if (sessionStorage.getItem(IS_LOGIN) == 'true') {
                setIsLogin(true);
                setUser(JSON.parse(sessionStorage.getItem(USER) || '') as UserProfile);
            } else {
                setUser(null);
            }
        } else {
            setIsLogin(false);
        }
    }, []);

    const accessibleBy = (roles: string[]) => {
        if (process.env.NODE_ENV === 'development') return true;
        return isLogin && user?.roles.some((role) => roles.includes(role));
    };
    //customise list of menu items for quemistry
    const model: AppMenuItem[] = [
        {
            label: 'Workdesk',
            items: [
                {
                    label: 'Practice',
                    icon: 'pi pi-fw pi-folder',
                    visible: accessibleBy(['student']),
                    items: [
                        { label: 'Take Quiz', icon: 'pi pi-fw pi-pencil', to: '/quiz/practice', visible: accessibleBy(['student']) },
                        { label: 'History', icon: 'pi pi-fw pi-history', to: '/quiz/history', visible: accessibleBy(['student']) }
                    ]
                },
                { label: 'Take Test', icon: 'pi pi-fw pi-graduation-cap', to: '/test', visible: accessibleBy(['student']) },
                { label: 'Dashboard', icon: 'pi pi-fw pi-chart-line', to: '/dashboard', visible: accessibleBy(['admin', 'tutor', 'student']) }
            ]
        },
        {
            label: 'Manage',
            items: [
                {
                    label: 'Questions',
                    icon: 'pi pi-fw pi-question-circle',
                    to: '/questions/searchlist',
                    visible: accessibleBy(['admin', 'tutor'])
                },
                {
                    label: 'Topics',
                    icon: 'pi pi-fw pi-tags',
                    to: '/questions/topics',
                    visible: accessibleBy(['admin', 'tutor'])
                },
                { label: 'Classes', icon: 'pi pi-fw pi-sitemap', to: '/classes', visible: accessibleBy(['tutor']) }
            ],
            visible: accessibleBy(['admin', 'tutor'])
        }
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
