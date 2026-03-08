// import { useEffect } from "react";
// import { useAppDispatch } from "./hooks/useAppDispatch";
// import { restoreSession } from "./features/auth/authThunks";
import AppRoutes from "./routes/AppRoutes";

const App = () => {
    // const dispatch = useAppDispatch();

    // useEffect(() => {
    //     (dispatch as any)(restoreSession());
    // }, [dispatch]);

    return <AppRoutes />;
};

export default App;