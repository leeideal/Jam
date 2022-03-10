import { BrowserRouter as Router, Route, Routes} from "react-router-dom"
import Concert from "../routes/Concert";
import Contact from "../routes/Contact";
import Home from "../routes/Home";
import Profile from "../routes/Profile";
import Session from "../routes/Session";
import Navbar from "./Navbar";
import Auth from "./Auth";

function RouteView() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/Jam/*" element={<Home />}></Route>
                <Route path="/Jam/session/*" element={<Session />}></Route>
                <Route path="/Jam/concert" element={<Concert />}></Route>
                <Route path="/Jam/profile" element={<Profile />}></Route>
                <Route path="/Jam/contact" element={<Contact />}></Route>
                <Route path="/Jam/auth" element={<Auth />}></Route>
            </Routes>
        </Router>
    );
}

export default RouteView;