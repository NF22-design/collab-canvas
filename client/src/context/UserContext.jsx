import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const stored = localStorage.getItem("canvasUser");
        if (stored) {
            setUser(JSON.parse(stored));
        }
    }, []);

    const loginUser = (userData) => {
        setUser(userData);
        localStorage.setItem("canvasUser", JSON.stringify(userData));
    };

    const logoutUser = () => {
        setUser(null);
        localStorage.removeItem("canvasUser");
    };

    return (
        <UserContext.Provider value={{ user, loginUser, logoutUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);