import { useRef, MutableRefObject } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { createContext } from "react";
import {Home} from "../pages/home/home";
import {Footer} from "./footer";
import {Header} from "./header";
import { Users } from "../pages/users/users";
import { Schedule } from "../pages/schedule/schedule";
import { Inventory } from "../pages/inventory/inventory";
import { Roles } from "../pages/roles/roles";
import { Clients } from "../pages/clients/clients";
import { I18nextProvider } from "react-i18next";
import { i18n } from "../../i18n";

const LayoutContext: any = createContext({});

function DefaultLayout(props: any) {

    const overlayRef: MutableRefObject<any> = useRef(null);

    return (
        <LayoutContext.Provider value={{
            overlayRef
        }}>
            <I18nextProvider i18n={i18n}>
                <div id={'wrapper'}>
                    <Header/>
                    <Routes>
                        <Route path={'/'} element={<Navigate to={'schedule'}/>}/>
                        <Route path={'home'} element={<Home/>}/>
                        <Route path={'schedule'} element={<Schedule/>}/>
                        <Route path={'staff'} element={<Users/>}/>
                        <Route path={'inventory'} element={<Inventory/>}/>
                        <Route path={'clients'} element={<Clients/>}/>
                        <Route path={'roles'} element={<Roles/>}/>
                        <Route path={'articles'} element={<Home/>}/>
                        <Route path={'/*'} element={<Navigate to={'/404'}/>}/>
                    </Routes>
                    <Footer/>
                </div>
                <div id={'overlay'} ref={overlayRef}>

                </div>
            </I18nextProvider>
        </LayoutContext.Provider>
    )
}

export {DefaultLayout, LayoutContext};