import {FormEvent, useContext, useEffect, useState} from "react";
import { API } from "../../../api/axios";
import CustomList from "../../props-list";
import { ErrorNotification } from "../../notifications";
import { tr } from "../../../i18n";
import { GlobalContext } from "../../global-context";

function Clients() {
    const {user} = useContext(GlobalContext);
    const [items, setItems] = useState([]);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        description: ""
    });
    const [editingItem, setEditingItem] = useState<null | {
        _id: string,
        name: string,
        email: string,
        phone: string,
        description: string
    }>(null);

    useEffect(() => {
        API.get('/clients').then((response: any) => {
            setItems(response.data);
        });
    }, []);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            if (editingItem) {
                await API.post('/clients/modify', {_id: editingItem._id, ...formData});
                setEditingItem(null);
            } 
            else {
                await API.post('/clients', formData);
            }
            setFormData({
                name: "",
                email: "",
                phone: "",
                description: ""
            });
            API.get('/clients').then((response: any) => {
                setItems(response.data);
            });
            setError(null);
        } catch (error) {
            setError(error.response.data.message || JSON.stringify(error.response.data));
        }
    };

    const handleRemove = async (itemId: string) => {
        try {
            await API.delete('/clients/' + itemId);
            API.get('/clients').then((response: any) => {
                setItems(response.data);
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
        description: string
      }) => {
        setEditingItem(item);
        setFormData({
          name: item.name,
          email: item.email,
          phone: item.phone,
          description: item.description,
        });
    }

    const handleNotEdit = () => {
        setEditingItem(null);
        setFormData({
            name: "",
            email: "",
            phone: "",
            description: ""
        });
    }

    return (
        <main>
            <ErrorNotification message={error} setMessage={setError}/>
            <section className="flex flex-wrap justify-between md:justify-center">
            {(user?.role?.permissions?.includes('create_clients') || editingItem) && (
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
                <CustomList items={items} renderItem={(item, index) => 
                    <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
                        <div className="border border-gray-300  rounded grid p-4 gap-2">
                            <h2 className="text-xl font-bold mb-2">{item.name}</h2>
                            <div className="grid grid-cols-2">
                                <strong className="font-bold">Email:</strong>
                                <p className="ml-4">{item.email}</p>
                            </div>
                            <div className="grid grid-cols-2">
                                <strong className="font-bold">{tr('phone')}:</strong>
                                <p className="ml-4">{item.phone}</p>
                            </div>
                            <div className="grid grid-cols-2">
                                <strong className="font-bold">{tr('description')}:</strong>
                                <p className="ml-4">{item.description}</p>
                            </div>
                        </div>
                        <div className="flex justify-between mt-2">
                            {user?.role?.permissions?.includes('edit_clients') && (
                                <button onClick={() => handleEdit(item)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                {tr('edit')}
                                </button>
                            )}
                            {user?.role?.permissions?.includes('delete_clients') && (
                                <button onClick={() => handleRemove(item._id)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
                                {tr('remove')}
                                </button>
                            )}
                        </div>
                    </div>
                }/>
            </div>
            </section>
        </main>
    )
}

export {Clients}