import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../global-context";

function Header(props: any) {
    const navigate = useNavigate();
    const {authenticated, signout} = useContext(GlobalContext);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleOrientationChange = () => {
          if (window.matchMedia("(orientation: landscape)").matches) {
            setMenuOpen(false);
          }
        };
    
        window.addEventListener('orientationchange', handleOrientationChange);
    
        return () => {
          window.removeEventListener('orientationchange', handleOrientationChange);
        };
    }, [setMenuOpen]);

    const handleMenuToggle = () => {
        setMenuOpen(!menuOpen);
    };

    const handleMenuClick = (route: string) => {
        navigate(route);
        setMenuOpen(false);
    };

    return (
        <header className={`bg-gray-900 text-white flex ${menuOpen ? 'flex-col' : ''} justify-between items-center py-4 px-8`}>
            {/* Logo */}
            <div className={`hidden sm:hidden md:flex items-center mt-4`}>
                {/* <img src="/logo.svg" alt="Logo" className="h-8 w-8 mr-2" /> */}
                <h1 className="text-xl font-bold">JuliGemCRM System</h1>
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden">
                <button className="text-white p-2 focus:outline-none" onClick={handleMenuToggle}>
                    <svg className="h-6 w-6" viewBox="0 0 24 24">
                        {menuOpen ? (
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M20 8H4V6h16v2zm0 5H4v-2h16v2zm0 5H4v-2h16v2z"
                                fill="currentColor"
                            />
                        ) : (
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M4 6h16v2H4V6zm0 7h16v2H4v-2zm0 5h16v2H4v-2z"
                                fill="currentColor"
                            />
                        )}
                    </svg>
                </button>
            </div>

            {/* Navigation links */}
            <nav className={`md:flex items-center ${menuOpen ? 'flex flex-col' : 'hidden'}`}>
                <button className={`text-white font-medium px-4 py-2 rounded-lg ${menuOpen ? 'mt-2' : 'mr-4'} bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75`} onClick={() => handleMenuClick("/d/schedule")}>
                    Schedule
                </button>
                <button className={`text-white font-medium px-4 py-2 rounded-lg ${menuOpen ? 'mt-2' : 'mr-4'} bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75`} onClick={() => handleMenuClick("/d/inventory")}>
                    Inventory
                </button>
                <button className={`text-white font-medium px-4 py-2 rounded-lg ${menuOpen ? 'mt-2' : 'mr-4'} bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75`} onClick={() => handleMenuClick("/d/clients")}>
                    Clients
                </button>
                <button className={`text-white font-medium px-4 py-2 rounded-lg ${menuOpen ? 'mt-2' : 'mr-4'} bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75`} onClick={() => handleMenuClick("/d/staff")}>
                    Staff
                </button>
                <button className={`text-white font-medium px-4 py-2 rounded-lg ${menuOpen ? 'mt-2' : 'mr-4'} bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75`} onClick={() => handleMenuClick("/d/roles")}>
                    Roles
                </button>
            </nav>

            {/* Log Out Button */}
            {authenticated &&
                <div className="flex items-center">
                    <button className={`text-white font-medium px-4 py-2 rounded-lg ${menuOpen ? 'mt-2' : 'mr-4'} bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-opacity-75`} onClick={() => { signout(); handleMenuClick("/signin") }}>
                        Log Out
                    </button>
                </div>
            }

            {/* Sign In / Sign Up Buttons */}
            {!authenticated && (
                <div className="flex items-center">
                    <button
                        className="text-white font-medium px-4 py-2 rounded-lg mr-4 bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-opacity-75"
                        onClick={() => handleMenuClick("/signin")}
                    >
                        Sign In
                    </button>
                    <button
                        className="text-primary-600 font-medium px-4 py-2 rounded-lg border border-primary-600 hover:text-white hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-opacity-75"
                        onClick={() => handleMenuClick("/signup")}
                    >
                        Sign Up
                    </button>
                </div>
            )}

        </header>
    )
}

export {Header};