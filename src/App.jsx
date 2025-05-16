import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard/Dashboard";
import PublicationDetail from "./pages/publicationDetails/publicationDetails.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/publication/:categoryName/:id" element={<PublicationDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
