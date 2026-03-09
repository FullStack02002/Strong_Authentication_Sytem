import { useEffect } from "react";
import { store } from "./app/store";
import { restoreSession } from "./features/auth/authThunks";
import AppRoutes from "./routes/AppRoutes";


const App = () => {

    useEffect(() => {
        (store.dispatch as any)(restoreSession());
    }, []);

    return <AppRoutes />;
};

export default App;