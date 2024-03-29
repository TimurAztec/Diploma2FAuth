import { ChangeEvent, FormEvent, useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API } from "../../../api/axios";
import { GlobalContext } from "../../global-context";
import {ErrorNotification} from "../../notifications";
import { tr } from "../../../i18n";

function ResetPassword() {
    const globalContext = useContext(GlobalContext);
    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: ""
    });
    const { token } = useParams();
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        try {
            await API.post('/auth/forgotPassword/' + token, formData);
            setFormData({
                password: "",
                confirmPassword: ""
            });
            setError(null);
            navigate("/d/schedule");
        } catch (error) {
            setError(error.response.data.message || JSON.stringify(error.response.data));
        }
    };

    return (
        <main>
            <ErrorNotification message={error} setMessage={setError}/>
            <section className="bg-gray-50 dark:bg-gray-900">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                {tr('reset your password')}
                            </h1>
                            <form className="space-y-4 md:space-y-6" action="#" onSubmit={handleSubmit}>
                                <div>
                                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{tr('new')} {tr('password')}</label>
                                    <input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={formData.password} onChange={handleInputChange} required={true}/>
                                </div>
                                <div>
                                    <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{tr('confirm')} {tr('password')}</label>
                                    <input type="password" name="confirmPassword" id="confirmPassword" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={formData.confirmPassword} onChange={handleInputChange} required={true}/>
                                </div>
                                <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">{tr('reset')} {tr('password')}</button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}

export {ResetPassword}