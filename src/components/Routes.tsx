import { BrowserRouter as Router, Route, Routes} from "react-router-dom"
import Concert from "../routes/Concert";
import Contact from "../routes/Contact";
import Home from "../routes/Home";
import Profile from "../routes/Profile";
import Session from "../routes/Session";
import Navbar from "./Navbar";

function RouteView() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/*" element={<Home />}></Route>
                <Route path="/session" element={<Session />}></Route>
                <Route path="/concert" element={<Concert />}></Route>
                <Route path="/profile" element={<Profile />}></Route>
                <Route path="/contact" element={<Contact />}></Route>
            </Routes>
        </Router>
    );
}

export default RouteView;