import AppRoutes from "./routes/index.tsx";
import { BrowserRouter } from "react-router-dom";
import WhatsAppButton from "./componens/whatsappButton.tsx";
import useVisitorTracker from "./hooks/useVisitorTracker";
import { Toaster } from "@/components/ui/sonner";

function Tracker() {
  useVisitorTracker();
  return null;
}

function App() {
  return (
    <BrowserRouter>
      <Tracker />
      <AppRoutes />
      <WhatsAppButton />
      <Toaster position="top-center" richColors />
    </BrowserRouter>
  );
}

export default App;