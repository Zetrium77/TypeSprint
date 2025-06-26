import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LanguageProvider } from "./theme/LanguageProvider";
import { ThemeProvider } from "./theme/ThemeProvider";
import "./index.css";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Training from "./pages/Training";
import Results from "./pages/Results";
import TextSelect from "./pages/TextSelect";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "training", element: <Training /> },
      { path: "results", element: <Results /> },
      { path: "select", element: <TextSelect /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LanguageProvider>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </LanguageProvider>
  </StrictMode>
);