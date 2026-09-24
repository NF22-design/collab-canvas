import { Routes, Route } from "react-router-dom";
import EntryPage from "./Pages/EntryPage.jsx";
import RoomsPage from "./Pages/RoomsPage.jsx";
import CanvasPage from "./Pages/CanvasPage.jsx"

function App() {
    return (
        <Routes>
            <Route path="/" element={<EntryPage />} />
            <Route path="/rooms" element={<RoomsPage />} />
            <Route path="/canvas/:roomId" element={<CanvasPage />} />
        </Routes>
    );
}

export default App;