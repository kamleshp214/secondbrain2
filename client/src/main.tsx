import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initializeDB } from "./db/seed";

// Initialize the database with seed data
initializeDB().then(() => {
  createRoot(document.getElementById("root")!).render(<App />);
});
