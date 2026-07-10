import { useNavigate } from "react-router-dom";
import { logoutUser } from "../services/authService";

export default function LogoutButton() {

    const navigate = useNavigate();

    const handleLogout = () => {

        logoutUser();

        navigate("/login", { replace: true });

    };

    return (
        <button onClick={handleLogout}>
            Logout
        </button>
    );

}