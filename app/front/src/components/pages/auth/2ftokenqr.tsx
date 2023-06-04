import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { API } from "../../../api/axios";
import { tr } from "../../../i18n";

function TokenQR() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { token } = useParams();
    const [tokenUrl, setTokenUrl] = useState('');

    useEffect(() => {
        if (state) {
            setTokenUrl((state as {tokenUrl: string}).tokenUrl);
        } else {
            API.get('/auth/forgotToken/' + token).then((response: any) => {
                setTokenUrl(response.data.tokenUrl);
            });
        }
    }, []);

    const handleSigninClick = async () => {
        navigate("/signin");
    }

    return (
        <main>
            <section className="bg-gray-50 dark:bg-gray-900">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                {tr('please scan this QR code with Google Authenticator app on your phone')}
                            </h1>
                            <div className="space-y-4 md:space-y-6">
                                <img
                                    src={tokenUrl}
                                    alt="QR code"
                                    className="mx-auto w-full h-auto max-w-xs object-contain"
                                />
                                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                    {tr('trand Sign In using 2F Token in app')}
                                </p>
                                <button onClick={handleSigninClick} className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">{tr('sign in')}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}

export {TokenQR}