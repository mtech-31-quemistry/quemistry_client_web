/* eslint-disable @next/next/no-img-element */

import Link from 'next/link';
import { classNames } from 'primereact/utils';
import React, { forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { AppTopbarRef } from '@/types';
import { LayoutContext } from './context/layoutcontext';
import { IS_LOGIN } from '../lib/constants';
import { Menu } from 'primereact/menu';
import { GoogleSigninService } from '@/service/GoogleSignInService';
import { useRouter } from 'next/navigation';

const AppTopbar = forwardRef<AppTopbarRef>((props, ref) => {
    const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar } = useContext(LayoutContext);
    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);
    const profilemenubuttonRef = useRef<Menu>(null);
    const [isLogin, setIsLogin] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (sessionStorage != undefined && sessionStorage.getItem(IS_LOGIN) === 'true') {
            setIsLogin(true);
        }
        //if(!isLogin){
        //     redirect("/");
        // }
    }, []);

    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
        topbarmenubutton: topbarmenubuttonRef.current,
        profilemenubutton: profilemenubuttonRef.current
    }));
    const toggleProfileMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        profilemenubuttonRef.current?.toggle(event);
    };

    const overlayMenuItems = [
        {
            label: 'View Profile',
            command: () => {
                router.push('/profile/edit');
            }
        },
        {
            separator: true
        },
        {
            label: 'Sign out',
            icon: 'pi pi-sign-out',
            command: (e: any) => {
                GoogleSigninService.signOut()
                    .then(() => {
                        setIsLogin(false);
                        router.push('/');
                    })
                    .catch((err) => {
                        setIsLogin(false);
                        router.push('/');
                    });
            }
        }
    ];

    return (
        <div className="layout-topbar">
            <Link href="/" className="layout-topbar-logo">
                <img src={`/layout/images/logo-${layoutConfig.colorScheme !== 'light' ? 'white' : 'dark'}.png`} width="37.22px" height="50px" alt="logo" />
                <span>QUEMISTRY</span>
            </Link>

            <button ref={menubuttonRef} type="button" className="p-link layout-menu-button layout-topbar-button" onClick={onMenuToggle}>
                <i className="pi pi-bars" />
            </button>

            <button ref={topbarmenubuttonRef} type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={showProfileSidebar}>
                <i className="pi pi-ellipsis-v" />
            </button>

            <div ref={topbarmenuRef} className={classNames('layout-topbar-menu', { 'layout-topbar-menu-mobile-active': layoutState.profileSidebarVisible })}>
                {isLogin || (
                    <Link href="/auth/google">
                        <button type="button" className="p-link layout-topbar-button">
                            <i className="pi pi-sign-in"></i>
                            <span>Sign in</span>
                        </button>
                    </Link>
                )}
                {!isLogin || (
                    <button type="button" className="p-link layout-topbar-button">
                        <i className="pi pi-calendar"></i>
                        <span>Calendar</span>
                    </button>
                )}
                {!isLogin || (
                    <div>
                        <Menu ref={profilemenubuttonRef} model={overlayMenuItems} popup />
                        <button type="button" className="p-link layout-topbar-button" onClick={toggleProfileMenu}>
                            <i className="pi pi-user"></i>
                            <span>Profile</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
});

AppTopbar.displayName = 'AppTopbar';

export default AppTopbar;
