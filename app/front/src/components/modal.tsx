import { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { useOutsideClickHandler } from "../utils/utils";

function Modal(props: any) {

    function handleClickOutside(e: any) {
        props.setModalOpen(false);
    }

    const clickOutsideRef = useRef(null);
    useOutsideClickHandler(clickOutsideRef, handleClickOutside);

    if (!props.open) return null;
    return ReactDOM.createPortal(
        <>
            <div className={`fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-70 z-40`}/>
            <div className={`${props.className} fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-10 z-50`} ref={clickOutsideRef}>
                {props.children}
            </div>
        </>,
        props.overlayRef.current
    )
}

export {Modal}