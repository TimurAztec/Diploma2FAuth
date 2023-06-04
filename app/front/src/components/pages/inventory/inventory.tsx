import {FormEvent, useEffect, useState} from "react";
import { API } from "../../../api/axios";
import CustomList from "../../props-list";
import { ErrorNotification } from "../../notifications";
import { tr } from "../../../i18n";

function Inventory() {
    const [items, setItems] = useState([]);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        quantity: "",
        location: ""
    });
    const [editingItem, setEditingItem] = useState<null | {
        _id: string,
        name: string,
        quantity: string,
        location: string
    }>(null);

    useEffect(() => {
        API.get('/inventory').then((response: any) => {
            setItems(response.data);
        });
    }, []);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            if (editingItem) {
                await API.post('/inventory/modify', {_id: editingItem._id, ...formData});
                setEditingItem(null);
            } 
            else {
                await API.post('/inventory', formData);
            }
            setFormData({
                name: "",
                quantity: "",
                location: ""
            });
            API.get('/inventory').then((response: any) => {
                setItems(response.data);
            });
            setError(null);
        } catch (error) {
            setError(error.response.data.message);
        }
    };

    const handleRemove = async (itemId: string) => {
        try {
            await API.delete('/inventory/' + itemId);
            API.get('/inventory').then((response: any) => {
                setItems(response.data);
            });
            setError(null);
        } catch (error) {
            setError(error.response.data.message);
        }
    };

    const handleEdit = (item: {
        _id: string,
        name: string,
        quantity: string,
        location: string
      }) => {
        setEditingItem(item);
        setFormData({
          name: item.name,
          quantity: item.quantity,
          location: item.location
        });
    }

    const handleNotEdit = () => {
        setEditingItem(null);
        setFormData({
          name: "",
          quantity: "",
          location: ""
        });
    }

    return (
        <main>
            <ErrorNotification message={error} setMessage={setError}/>
            <section className="flex flex-wrap justify-between md:justify-center">
            <div className="flex-1 md:flex-0 m-2 justify-center">
                <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
                        {tr('Title')}
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
                        <label htmlFor="quantity" className="block text-gray-700 font-bold mb-2">
                        {tr('Quantity')}
                        </label>
                        <input
                        type="number"
                        id="quantity"
                        name="quantity"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        required={true}
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="location" className="block text-gray-700 font-bold mb-2">
                        {tr('Location')}
                        </label>
                        <input
                        type="text"
                        id="location"
                        name="location"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={formData.location}
                        onChange={handleInputChange}
                        required={true}
                        />
                    </div>
                    {editingItem ? (
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
                    ) : (
                        <div className="flex items-center justify-between">
                            <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                            {tr('create')}
                            </button>
                        </div>
                    ) 
                    }
                </form>
            </div>
            <div className="flex-1 md:flex-0  m-2">
                <CustomList items={items} renderItem={(item, index) => 
                    <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
                        <div>
                            <h2 className="font-bold text-xl mb-2">{item.name} | {item._id}</h2>
                            <p className="text-gray-700 text-base mb-2">{item.quantity}</p>
                            <p className="text-gray-700 text-base mb-2">{item.location}</p>
                        </div>
                        <div className="flex justify-between">
                            <button onClick={() => handleEdit(item)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            {tr('edit')}
                            </button>
                            <button onClick={() => handleRemove(item._id)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
                            {tr('remove')}
                            </button>
                        </div>
                    </div>
                }/>
            </div>
            </section>
        </main>
    )
}

export {Inventory}