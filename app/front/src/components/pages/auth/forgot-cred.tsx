import { FormEvent, useContext, useState } from "react";
import { API } from "../../../api/axios";
import { GlobalContext } from "../../global-context";
import {ErrorNotification, SuccessNotification} from "../../notifications";

function ForgotCred({credential}: {credential: string}) {
    const globalContext = useContext(GlobalContext);
    const [formData, setFormData] = useState({
        email: ""
    });
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            await API.post('/auth/forgot' + credential, formData);
            setFormData({
                email: ""
            });
            setError(null);
            setMessage(`${credential} resset link been sent to your email` as any);
        } catch (error) {
            setError(error.response.data.message);
        }
    };

    return (
        <main>
            <ErrorNotification message={error} setMessage={setError}/>
            <SuccessNotification message={message} setMessage={setMessage}/>
            <section className="bg-gray-50 dark:bg-gray-900">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                Enter your email
                            </h1>
                            <form className="space-y-4 md:space-y-6" action="#" onSubmit={handleSubmit}>
                                <div>
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                                    <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@domain.com" value={formData.email} onChange={handleInputChange} required={true}/>
                                </div>
                                <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Send resset link</button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}

export {ForgotCred}