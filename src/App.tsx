import AppRoutes from "./routes/index.tsx";
import { BrowserRouter } from "react-router-dom";
import WhatsAppButton from "./componens/whatsappButton.tsx";
import useVisitorTracker from "./hooks/useVisitorTracker";

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
    </BrowserRouter>
  );
}

export default App;