import {useEffect, useState} from "react";
import { API } from "../../../api/axios";

function Users() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        API.get('/users').then((response: any) => {
            setUsers(response.data);
        });
    }, []);

    return (
        <main>
            <section>
                {users.map((user: any) => {
                    return <div>{JSON.stringify(user)}</div> 
                })}
            </section>
        </main>
    )
}

export {Users}