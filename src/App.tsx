import Route from "./routes/index.tsx"
import {BrowserRouter} from "react-router-dom";
function App() {
  return (
      <BrowserRouter>
          <Route/>
      </BrowserRouter>
  )
}

export default App