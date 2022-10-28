import logo from "./logo.svg";
import "./App.css";
import Home from "./home";
import Preprocessing from "./preprocessing";
import Elimination from "./elimination";
import Cluster from "./cluster";
import NavBar from "./NavBar";
import { Routes, Route, Link } from "react-router-dom";
import Container from "react-bootstrap/Container";

function App() {
  return (
    <div className="App">
      <Container>
        <NavBar />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/preprocessing" element={<Preprocessing />} />
          <Route exact path="/elimination" element={<Elimination />} />
          <Route exact path="/cluster" element={<Cluster />} />
        </Routes>
      </Container>
    </div>
  );
}

export default App;
