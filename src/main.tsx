import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initializeServiceProviders } from "./lib/mongodb";

// Initialize database collections
initializeServiceProviders().catch(console.error);

createRoot(document.getElementById("root")!).render(<App />);
