import { createRoot } from "react-dom/client";
import AppRouter from "@routes/AppRouter";

// Styles
import "@styles/index.css";

// Redux
import store, { persistor } from "@store/store";
import { Provider } from "react-redux";

// axios global
import "@services/axios-global";
import { PersistGate } from "redux-persist/integration/react";

createRoot(document.getElementById("root")!).render(
  <PersistGate loading={null} persistor={persistor}>
    <Provider store={store}>
      <AppRouter />
    </Provider>
  </PersistGate>
);
