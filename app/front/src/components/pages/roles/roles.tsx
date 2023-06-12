import React, { useState, useEffect, FormEvent, useContext } from 'react';
import { API } from '../../../api/axios';
import { ErrorNotification } from '../../notifications';
import { tr } from '../../../i18n';
import PermissionsList from './permissions-list';
import { GlobalContext } from '../../global-context';

interface Role {
  _id: string;
  name: string;
  permissions: string[];
  priority: number;
}

function Roles() {
    const {user} = useContext(GlobalContext);
    const [roles, setRoles] = useState<Role[]>([]);
    const [permissions, setPermissions] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        permissions: [] as string[],
        priority: 1
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
            setError(error.response.data.message || JSON.stringify(error.response.data));
        }
    };

    const fetchPermissions = async () => {
        try {
            const response = await API.get('/permissions');
            setPermissions(response.data);
            setError(null);
        } catch (error) {
            setError(error.response.data.message || JSON.stringify(error.response.data));
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
                await API.put(`/roles/modify`, {...formData, id: editingRole._id, priority: formData.priority.toString()});
                setEditingRole(null);
            } else {
                await API.post('/roles', {...formData, priority: formData.priority.toString()});
            }
            setFormData({
                name: '',
                permissions: [],
                priority: 1
            });
            fetchRoles();
            setError(null);
        } catch (error) {
            setError(error.response.data.message || JSON.stringify(error.response.data));
        }
    };

    const handleRemove = async (roleId: string) => {
        try {
        await API.delete(`/roles/${roleId}`);
        fetchRoles();
        setError(null);
        } catch (error) {
            setError(error.response.data.message || JSON.stringify(error.response.data));
        }
    };

    const handleEdit = (role: Role) => {
        setEditingRole(role);
        setFormData({
        name: role.name,
        permissions: role.permissions,
        priority: role.priority
        });
    };

    const handleNotEdit = () => {
        setEditingRole(null);
        setFormData({
        name: '',
        permissions: [],
        priority: 1
        });
    };

    return (
        <main>
        <ErrorNotification message={error} setMessage={setError}/>
        <section className="flex flex-wrap justify-between md:justify-center">
            <div className="flex-1 md:flex-0 m-2 justify-center">
            {(user?.role?.permissions?.includes('create_roles') || editingRole) && (
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
                    <PermissionsList permissions={permissions} permissionsData={formData.permissions} handlePermissionChange={handlePermissionChange}/>
                </div>
                <div className="mb-4">
                    <label htmlFor="priority" className="block text-gray-700 font-bold mb-2">
                    {tr('Priority')}
                    </label>
                    <input
                    type="number"
                    id="priority"
                    name="priority"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={formData.priority}
                    min={1}
                    onChange={handleInputChange}
                    required={true}
                    />
                </div>
                {editingRole ? (
                    <>
                    {user?.role?.permissions?.includes('edit_roles') && (
                    <div className="flex items-center justify-between">
                        <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                        {tr('update')}
                        </button>
                        <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        onClick={handleNotEdit}
                        >
                        {tr('notupdate')}
                        </button>
                    </div>
                    )}
                    </>
                ) : (
                    <>
                    {user?.role?.permissions?.includes('create_roles') && (
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
                )}
            </form>
            )}
            </div>
            <div className="flex-1 md:flex-0  m-2">
            {roles.map((role) => (
                <div key={role._id} className="bg-white rounded-lg shadow-lg p-4 mb-4">
                    <div>
                        <h2 className="font-bold text-xl mb-2">{role.name}</h2>
                        <PermissionsList permissions={permissions} permissionsData={role.permissions}/>
                        <p className="text-gray-700 text-base mb-2">
                            {tr('Priority')}: {role.priority}
                        </p>
                    </div>
                    <div className="flex justify-between">
                        {user?.role?.permissions?.includes('edit_roles') && (
                        <button
                        onClick={() => handleEdit(role)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                        {tr('edit')}
                        </button>
                        )}
                        {user?.role?.permissions?.includes('delete_roles') && (
                        <button
                        onClick={() => handleRemove(role._id)}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                        >
                        {tr('remove')}
                        </button>
                        )}
                    </div>
                </div>
            ))}
            </div>
        </section>
        </main>
    );
}

export { Roles };