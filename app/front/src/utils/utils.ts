import { useEffect } from "react";

function randNum(max: number, min: number = 1) {
    return Math.floor(Math.random() * max) + min;
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function useOutsideClickHandler(ref: any, callback: Function) {
    useEffect(() => {
      function handleClickOutside(event: any) {
        if (ref.current && !ref.current.contains(event.target)) {
          callback(event);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
}

export {
    randNum,
    sleep,
    useOutsideClickHandler
}