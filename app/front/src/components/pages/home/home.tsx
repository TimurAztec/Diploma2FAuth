import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();

    const handleUsersClick = async () => {
        navigate("/d/users");
    }

    return (
        <main>
            <section>
                <h1>Home page</h1>
                <button onClick={handleUsersClick}>Go to protected user info page</button>
            </section>
        </main>
    )
}

export {Home}