import React, { useState, useEffect, FormEvent } from 'react';
import { API } from '../../../api/axios';
import { ErrorNotification } from '../../notifications';

interface Role {
  _id: string;
  name: string;
  permissions: string[];
}

function Roles() {
    const [roles, setRoles] = useState<Role[]>([]);
    const [permissions, setPermissions] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        permissions: [] as string[],
    });
    const [editingRole, setEditingRole] = useState<null | Role>(null);

    useEffect(() => {
        fetchRoles();
        fetchPermissions();
    }, []);

    const fetchRoles = async () => {
        try {
        const response = await API.get('/roles');
        setRoles(response.data);
        setError(null);
        } catch (error) {
        setError(error.response.data.message);
        }
    };

    const fetchPermissions = async () => {
        try {
          const response = await API.get('/permissions');
          setPermissions(response.data);
          setError(null);
        } catch (error) {
          setError(error.response.data.message);
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
        }));
    };

    const handlePermissionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = event.target;
        setFormData((prevFormData) => {
        if (checked) {
            return {
            ...prevFormData,
            permissions: [...prevFormData.permissions, value],
            };
        } else {
            return {
            ...prevFormData,
            permissions: prevFormData.permissions.filter((permission) => permission !== value),
            };
        }
        });
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
        if (editingRole) {
            await API.put(`/roles/modify`, {id: editingRole._id, ...formData});
            setEditingRole(null);
        } else {
            await API.post('/roles', formData);
        }
        setFormData({
            name: '',
            permissions: [],
        });
        fetchRoles();
        setError(null);
        } catch (error) {
        setError(error.response.data.message);
        }
    };

    const handleRemove = async (roleId: string) => {
        try {
        await API.delete(`/roles/${roleId}`);
        fetchRoles();
        setError(null);
        } catch (error) {
        setError(error.response.data.message);
        }
    };

    const handleEdit = (role: Role) => {
        setEditingRole(role);
        setFormData({
        name: role.name,
        permissions: role.permissions,
        });
    };

    const handleNotEdit = () => {
        setEditingRole(null);
        setFormData({
        name: '',
        permissions: [],
        });
    };

    return (
        <main>
        <ErrorNotification message={error} setMessage={setError}/>
        <section className="flex flex-wrap justify-between md:justify-center">
            <div className="flex-1 md:flex-0 m-2 justify-center">
            <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
                <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
                    Name
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
                <label className="block text-gray-700 font-bold mb-2">Permissions</label>
                {permissions.map((permission) => (
                    <div key={permission} className="flex items-center">
                        <input
                            type="checkbox"
                            id={permission}
                            name="permissions"
                            value={permission}
                            checked={formData.permissions.includes(permission)}
                            onChange={handlePermissionChange}
                        />
                        <label htmlFor={permission} className="ml-2 text-gray-700">
                            {permission}
                        </label>
                    </div>
                ))}
                </div>
                {editingRole ? (
                <div className="flex items-center justify-between">
                    <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                    Update Role
                    </button>
                    <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    onClick={handleNotEdit}
                    >
                    Cancel Edit
                    </button>
                </div>
                ) : (
                <div className="flex items-center justify-between">
                    <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                    Create Role
                    </button>
                </div>
                )}
            </form>
            </div>
            <div className="flex-1 md:flex-0  m-2">
            {roles.map((role) => (
                <div key={role._id} className="bg-white rounded-lg shadow-lg p-4 mb-4">
                    <div>
                        <h2 className="font-bold text-xl mb-2">{role.name}</h2>
                        <ul className="list-disc pl-6">
                        {role.permissions.map((permission) => (
                            <li key={permission} className="text-gray-700 text-base mb-2">
                            {permission}
                            </li>
                        ))}
                        </ul>
                    </div>
                    <div className="flex justify-between">
                        <button
                        onClick={() => handleEdit(role)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                        Edit
                        </button>
                        <button
                        onClick={() => handleRemove(role._id)}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                        >
                        Remove
                        </button>
                    </div>
                </div>
            ))}
            </div>
        </section>
        </main>
    );
}

export { Roles };