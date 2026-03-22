import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store } from "./app/store";
import App from "./App";
import "./index.css";
import { Toaster } from "sonner";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { env } from "./config/env";


createRoot(document.getElementById("root")!).render(
    <Provider store={store}>
        <BrowserRouter>
            <GoogleReCaptchaProvider
                reCaptchaKey={env.RECAPTCHA_SITE_KEY}
                scriptProps={{ async: true, defer: true, id:"recaptcha-script", }}
            >
                <App />
            </GoogleReCaptchaProvider>
            <Toaster position="bottom-right" theme="dark" richColors />
        </BrowserRouter>
    </Provider>
);