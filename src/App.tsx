import AppRoutes from "./routes/index.tsx";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import WhatsAppButton from "./componens/whatsappButton.tsx";
import useVisitorTracker from "./hooks/useVisitorTracker";
import { Toaster } from "@/components/ui/sonner";
import SiteLoader from "./components/siteLoader";

function Tracker() {
  useVisitorTracker();
  return null;
}

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <SiteLoader />
        <Tracker />
        <AppRoutes />
        <WhatsAppButton />
        <Toaster position="top-center" richColors />
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;