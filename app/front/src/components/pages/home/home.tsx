import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();

    return (
        <main>
            <section>
                <h1>Home page, nothing here yet</h1>
            </section>
        </main>
    )
}

export {Home}