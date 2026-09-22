import AppRoutes from "./routes/index.tsx";
import { BrowserRouter } from "react-router-dom";
import WhatsAppButton from "./componens/whatsappButton.tsx";
import useVisitorTracker from "./hooks/useVisitorTracker";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";

function Tracker() {
  useVisitorTracker();
  return null;
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <BrowserRouter>
        <Tracker />
        <AppRoutes />
        <WhatsAppButton />
        <Toaster position="top-center" richColors />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;