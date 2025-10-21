import { createRoot } from "react-dom/client";
import "./index.css";
import "./i18n"; // Initialize i18n
import Router from "./router";
import { ThemeProvider } from "./core/context/ThemeContext.tsx";
import { Provider } from 'react-redux'
import {store} from "./store";
import 'animate.css';

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <Provider store={store}>
      <Router />
    </Provider>
  </ThemeProvider>
);
