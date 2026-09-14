import {
    useEffect,
    useState
} from "react";

import {
    getCurrentUser
} from "../services/authService";

import AuthContext from "./AuthContext";


const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadCurrentUser = async () => {

        try {

            const response =
                await getCurrentUser();

            setUser(
                response.data?.user || null
            );

        }
        catch (error) {

            setUser(null);

        }
        finally {

            setLoading(false);

        }
    };

    useEffect(() => {

        loadCurrentUser();

    }, []);

    const value = {
        user,
        setUser,
        loading,
        isAuthenticated: !!user,
        refreshUser: loadCurrentUser
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};


export default AuthProvider;