import {FormEvent, useContext, useEffect, useState} from "react";
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
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        description: "",
        role: null
    });
    const [editingItem, setEditingItem] = useState<null | {
        _id: string,
        name: string,
        email: string,
        phone: string,
        description: string,
        role: any
    }>(null);

    useEffect(() => {
        API.get('/users').then((response: any) => {
            setUsers(response.data);
        }).catch((error: any) => {
            setError(error.response.data.message || JSON.stringify(error.response.data));
        });

        if (user?.role?.permissions?.includes('read_roles')) {
            API.get('/roles').then((response: any) => {
                setRoles(response.data);
            }).catch((error: any) => {
                setError(error.response.data.message || JSON.stringify(error.response.data));
            });
        }
    }, []);

    const [roleMenuOpen, setRoleMenuOpen] = useState<boolean>(false);

    const handleRoleMenuClick = () => {
        setRoleMenuOpen(!roleMenuOpen);
    };

    const handleRoleChange = async (newRole: any) => {
        formData.role = newRole;
        setRoleMenuOpen(false);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            if (editingItem) {
                await API.post('/users/modify', {...formData, _id: editingItem._id, role: formData.role._id});
                setEditingItem(null);
            } 
            else {
                await API.post('/users', formData);
            }
            setFormData({
                name: "",
                email: "",
                phone: "",
                description: "",
                role: null
            });
            API.get('/users').then((response: any) => {
                setUsers(response.data);
            });
            setError(null);
        } catch (error) {
            setError(error.response.data.message || JSON.stringify(error.response.data));
        }
    };

    const handleEdit = (item: {
        _id: string,
        name: string,
        email: string,
        phone: string,
        description: string,
        role: any
      }) => {
        setEditingItem(item);
        setFormData({
          name: item.name,
          email: item.email,
          phone: item.phone,
          description: item.description,
          role: null
        });
    }

    const handleNotEdit = () => {
        setEditingItem(null);
        setFormData({
            name: "",
            email: "",
            phone: "",
            description: "",
            role: null
        });
    }

    const handleRemove = async (itemId: string) => {
        try {
            await API.delete('/users/' + itemId);
            API.get('/users').then((response: any) => {
                setUsers(response.data);
            });
            setError(null);
        } catch (error) {
            setError(error.response.data.message || JSON.stringify(error.response.data));
        }
    };

    return (
        <main>
            <ErrorNotification message={error} setMessage={setError}/>
            <section className="flex flex-wrap justify-between md:justify-center">
                {editingItem && (
                <div className="flex-1 md:flex-0 m-2 justify-center">
                    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
                            {tr('Name')}
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={formData.name}
                            onChange={handleInputChange}
                            required={true}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={formData.email}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="phone" className="block text-gray-700 font-bold mb-2">
                            {tr('phone')}
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required={true}
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="description" className="block text-gray-700 font-bold mb-2">
                            {tr('description')}
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={formData.description}
                            onChange={handleInputChange}
                        ></textarea>
                    </div>
                    <div className="mb-6">
                        <p className="text-gray-700 text-base mr-2">
                            {tr('Role')}: <span className="font-bold">{formData.role?.name || editingItem.role?.name}</span>
                        </p>
                        {user?.role?.permissions?.includes('edit_staff') && (
                        <div className="relative inline-block text-left">
                            <div>
                                <div className="cursor-pointer flex items-center justify-between w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" id="role-menu" aria-haspopup="true" aria-expanded={roleMenuOpen ? "true" : "false"} onClick={() => handleRoleMenuClick()}>
                                {tr('Change role')}
                                <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M6.293 6.293a1 1 0 0 1 1.414 0L10 8.586l2.293-2.293a1 1 0 1 1 1.414 1.414L11.414 10l2.293 2.293a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 0-1.414z" clipRule="evenodd" />
                                </svg>
                                </div>
                            </div>
                            {roleMenuOpen && (
                                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100" role="menu" aria-orientation="vertical" aria-labelledby="role-menu">
                                    <div className="py-1" role="none">
                                    {roles.map((role: any) => (
                                        <button
                                        key={role.id}
                                        className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 hover:text-gray-900"
                                        role="menuitem"
                                        onClick={() => handleRoleChange(role)}
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
                        {editingItem ? (
                            <>
                            {user?.role?.permissions?.includes('edit_clients') && (
                                <div className="flex items-center justify-between">
                                    <button
                                    type="submit"
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    >
                                    {tr('update')}
                                    </button>
                                    <button
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    onClick={handleNotEdit}>
                                    {tr('notupdate')}
                                    </button>
                                </div>
                            )}
                            </>
                        ) : (
                            <>
                            {user?.role?.permissions?.includes('create_clients') && (
                                <div className="flex items-center justify-between">
                                    <button
                                    type="submit"
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    >
                                    {tr('create')}
                                    </button>
                                </div>
                            )}
                            </>
                        ) 
                        }
                    </form>
                </div>
                )}
                <div className="flex-1 md:flex-0  m-2">
                    <CustomList items={users} renderItem={(item, index) => 
                        <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
                            <div>
                            <h2 className="font-bold text-xl mb-2">{item.name}</h2>
                            <p className="text-gray-700 text-base mb-2">{item.email} | {item.phone}</p>
                            <div className="flex items-center">
                                <p className="text-gray-700 text-base mr-2">
                                    {tr('Role')}: <span className="font-bold">{item.role?.name}</span>
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-700 text-base mr-2">
                                        {item.description}
                                </p>
                            </div>
                            <div className="flex justify-between mt-2">
                                {user?.role?.permissions?.includes('edit_clients') && (
                                    <button onClick={() => handleEdit(item)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                    {tr('edit')}
                                    </button>
                                )}
                                {user?.role?.permissions?.includes('delete_staff') && (
                                    <button onClick={() => handleRemove(item.id)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
                                        {tr('remove')}
                                    </button>
                                )}
                            </div>
                        </div>
                        </div>
                    }/>
                </div>
            </section>
        </main>
    )
}

export {Users}