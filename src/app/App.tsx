import { RouterProvider } from "react-router";
import { router } from "./routes.tsx";
import { AppProvider } from "./context/AppContext";

export default function App() {
  return (
    <AppProvider key="app-provider-remount">
      <RouterProvider key="router-remount" router={router} />
    </AppProvider>
  );
}
// Force HMR reload
