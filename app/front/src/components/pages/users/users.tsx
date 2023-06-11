import {useContext, useEffect, useState} from "react";
import { API } from "../../../api/axios";
import CustomList from "../../props-list";
import { ErrorNotification } from "../../notifications";
import { tr } from "../../../i18n";
import { GlobalContext } from "../../global-context";

function Users() {
    const {user} = useContext(GlobalContext);
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        API.get('/users').then((response: any) => {
            setUsers(response.data);
        }).catch((error: any) => {
            setError(error.response.data.message);
        });

        if (user?.role?.permissions?.includes('read_roles')) {
            API.get('/roles').then((response: any) => {
                setRoles(response.data);
            }).catch((error: any) => {
                setError(error.response.data.message);
            });
        }
    }, []);

    const [roleMenuOpenIndex, setRoleMenuOpenIndex] = useState<number | null>(null);

    const handleRoleMenuClick = (index: number) => {
        if (roleMenuOpenIndex === index) {
            setRoleMenuOpenIndex(null);
        } else {
            setRoleMenuOpenIndex(index);
        }
    };

    const handleRoleChange = async (user: any, newRoleId: string) => {
        try {
            user.role = newRoleId;
            await API.post('/users/modify', user);
            API.get('/users').then((response: any) => {
                setUsers(response.data);
            });
            setError(null);
        } catch (error) {
            setError(error.response.data.message);
        }
    };

    const handleRemove = async (itemId: string) => {
        try {
            await API.delete('/users/' + itemId);
            API.get('/users').then((response: any) => {
                setUsers(response.data);
            });
            setError(null);
        } catch (error) {
            setError(error.response.data.message);
        }
    };

    return (
        <main>
            <ErrorNotification message={error} setMessage={setError}/>
            <section>
                <CustomList items={users} renderItem={(item, index) => 
                    <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
                        <div>
                        <h2 className="font-bold text-xl mb-2">{item.name}</h2>
                        <p className="text-gray-700 text-base mb-2">{item.email}</p>
                        <div className="flex items-center">
                            <p className="text-gray-700 text-base mr-2">
                                {tr('Role')}: <span className="font-bold">{item.role?.name}</span>
                            </p>
                            {user?.role?.permissions?.includes('edit_staff') && (
                            <div className="relative inline-block text-left">
                                <div>
                                    <button className="flex items-center justify-between w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" id="role-menu" aria-haspopup="true" aria-expanded={roleMenuOpenIndex == index ? "true" : "false"} onClick={() => handleRoleMenuClick(index)}>
                                    {tr('Change role')}
                                    <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M6.293 6.293a1 1 0 0 1 1.414 0L10 8.586l2.293-2.293a1 1 0 1 1 1.414 1.414L11.414 10l2.293 2.293a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 0-1.414z" clipRule="evenodd" />
                                    </svg>
                                    </button>
                                </div>
                                {roleMenuOpenIndex == index && (
                                    <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100" role="menu" aria-orientation="vertical" aria-labelledby="role-menu">
                                        <div className="py-1" role="none">
                                        {roles.map((role: any) => (
                                            <button
                                            key={role.id}
                                            className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 hover:text-gray-900"
                                            role="menuitem"
                                            onClick={() => handleRoleChange(item, role._id)}
                                            >
                                            {role.name}
                                            </button>
                                        ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            )}
                        </div>
                        {user?.role?.permissions?.includes('delete_staff') && (
                            <button onClick={() => handleRemove(item.id)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
                                {tr('remove')}
                            </button>
                        )}
                    </div>
                    </div>
                }/>
            </section>
        </main>
    )
}

export {Users}