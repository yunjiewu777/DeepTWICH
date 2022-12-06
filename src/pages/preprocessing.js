import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import Nav from "react-bootstrap/Nav";
import { LinkContainer } from "react-router-bootstrap";

function Preprocessing() {
  const [data, setData] = useState([{}]);

  useEffect(() => {
    fetch("/members")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        console.log(data);
      });
  }, []);

  return (
    <div>
      <NavBar></NavBar>

      <Nav justify variant="tabs" defaultActiveKey="/">
        <Nav.Item>
          <LinkContainer to="/clus-vis/preprocessing/elimination">
            <Nav.Link>Elimination</Nav.Link>
          </LinkContainer>
        </Nav.Item>
        <Nav.Item>
          <LinkContainer to="/clus-vis/preprocessing/keyword">
            <Nav.Link>Keyword</Nav.Link>
          </LinkContainer>
        </Nav.Item>
      </Nav>

      <h1>Welcome to Preprocessing Page!</h1>
    </div>
  );
}

export default Preprocessing;
