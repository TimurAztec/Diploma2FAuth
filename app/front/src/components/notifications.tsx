import { useState } from "react";

const ErrorNotification = ({ message, setMessage }: {message: string | null, setMessage: Function}) => {
    return (
        (message != null) ?
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error:</strong>
        <span className="block sm:inline">{message}</span>
        <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
            <svg onClick={() => setMessage(null)} className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.25 1.25 0 01-1.768 1.768L10 11.768l-2.58 2.58a1.25 1.25 0 01-1.768-1.768L8.232 10 5.651 7.42a1.25 1.25 0 011.768-1.768L10 8.232l2.58-2.58a1.25 1.25 0 011.768 1.768L11.768 10l2.58 2.58z"/></svg>
        </span>
        </div>
        :
        <div/>
    );
};

export default ErrorNotification;