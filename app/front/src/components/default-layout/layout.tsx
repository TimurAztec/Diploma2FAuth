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

const LayoutContext: any = createContext({});

function DefaultLayout(props: any) {

    const overlayRef: MutableRefObject<any> = useRef(null);

    return (
        <LayoutContext.Provider value={{
            overlayRef
        }}>
            <div id={'wrapper'}>
                <Header/>
                <Routes>
                    <Route path={'/'} element={<Navigate to={'home'}/>}/>
                    <Route path={'home'} element={<Home/>}/>
                    <Route path={'schedule'} element={<Schedule/>}/>
                    <Route path={'staff'} element={<Users/>}/>
                    <Route path={'inventory'} element={<Inventory/>}/>
                    <Route path={'roles'} element={<Roles/>}/>
                    <Route path={'articles'} element={<Home/>}/>
                    <Route path={'/*'} element={<Navigate to={'/404'}/>}/>
                </Routes>
                <Footer/>
            </div>
            <div id={'overlay'} ref={overlayRef}>

            </div>
        </LayoutContext.Provider>
    )
}

export {DefaultLayout, LayoutContext};