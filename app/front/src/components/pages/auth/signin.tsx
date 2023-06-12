import { ChangeEvent, FormEvent, useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../../../api/axios";
import { GlobalContext } from "../../global-context";
import {ErrorNotification} from "../../notifications";
import { tr } from "../../../i18n";

function Signin() {
    const globalContext = useContext(GlobalContext);
    const [token, setToken] = useState('');
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        twofatoken: ""
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleTokenChange= (event: ChangeEvent<HTMLInputElement>, index: number) => {
        const value = event.target.value.replace(/\D/g, '');
        setToken((prevToken) => {
            const newToken = prevToken.slice(0, index) + value + prevToken.slice(index + 1);
            formData.twofatoken = newToken;
            return newToken;
        });
        if (!value && index > 0) {
            if (tokenInputRefs[index - 1]?.current) {
                //@ts-ignore
                tokenInputRefs[index - 1].current.focus();
            }
        } else if (value && index < 5) {
            if (tokenInputRefs[index + 1]?.current) {
                //@ts-ignore
                tokenInputRefs[index + 1].current.focus();
            }
        }
    }

    const tokenInputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const response = await API.post('/auth/signin', formData);
            const { accessToken } = response.data;
            globalContext.signin(accessToken);
            setFormData({
                email: "",
                password: "",
                twofatoken: ""
            });
            setError(null);
            navigate("/d/schedule");
        } catch (error) {
            setError(error.response.data.message || JSON.stringify(error.response.data));
        }
    };

    const handleSignupClick = async () => {
        navigate("/signup");
    }

    return (
        <main>
            <ErrorNotification message={error} setMessage={setError}/>
            <section className="bg-gray-50 dark:bg-gray-900">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                {tr('sign in to your account')}
                            </h1>
                            <form className="space-y-4 md:space-y-6" action="#" onSubmit={handleSubmit}>
                                <div>
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{tr('your')} email</label>
                                    <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@domain.com" value={formData.email} onChange={handleInputChange} required={true}/>
                                </div>
                                <div>
                                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{tr('your')} {tr('password')}</label>
                                    <input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={formData.password} onChange={handleInputChange} required={true}/>
                                </div>
                                <div>
                                    <label htmlFor="2Ftoken" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">2F {tr('token')}</label>
                                    <div className="flex space-x-2">
                                        <input type="text" className="w-full h-12 text-center border-gray-300 border-2 rounded-md" maxLength={1} value={token[0] || ''} onChange={(event) => handleTokenChange(event, 0)} ref={tokenInputRefs[0]} required={true}/>
                                        <input type="text" className="w-full h-12 text-center border-gray-300 border-2 rounded-md" maxLength={1} value={token[1] || ''} onChange={(event) => handleTokenChange(event, 1)} ref={tokenInputRefs[1]} required={true}/>
                                        <input type="text" className="w-full h-12 text-center border-gray-300 border-2 rounded-md" maxLength={1} value={token[2] || ''} onChange={(event) => handleTokenChange(event, 2)} ref={tokenInputRefs[2]} required={true}/>
                                        <input type="text" className="w-full h-12 text-center border-gray-300 border-2 rounded-md" maxLength={1} value={token[3] || ''} onChange={(event) => handleTokenChange(event, 3)} ref={tokenInputRefs[3]} required={true}/>
                                        <input type="text" className="w-full h-12 text-center border-gray-300 border-2 rounded-md" maxLength={1} value={token[4] || ''} onChange={(event) => handleTokenChange(event, 4)} ref={tokenInputRefs[4]} required={true}/>
                                        <input type="text" className="w-full h-12 text-center border-gray-300 border-2 rounded-md" maxLength={1} value={token[5] || ''} onChange={(event) => handleTokenChange(event, 5)} ref={tokenInputRefs[5]} required={true}/>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <a href="#" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500" onClick={() => navigate("/forgotPassword")}>{tr('forgot')} {tr('password')}?</a>
                                    <a href="#" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500" onClick={() => navigate("/forgotToken")}>{tr('forgot')} 2F {tr('token')}?</a>
                                </div>
                                <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">{tr('sign in')}</button>
                                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                    {tr('don’t have an account yet')}? <a href="#" onClick={handleSignupClick} className="font-medium text-primary-600 hover:underline dark:text-primary-500">{tr('sign up')}</a>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}

export {Signin}