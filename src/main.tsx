import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App"
import { ClinicianScreen } from "./screens/ClinicianScreen"

// No router: the patient app lives at /, the clinician's view at /clinician.
const isClinician = window.location.pathname.replace(/\/$/, "") === "/clinician"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {isClinician ? <ClinicianScreen /> : <App />}
  </StrictMode>,
)
