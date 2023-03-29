import React from "react";
import { Link } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import { LinkContainer } from "react-router-bootstrap";
import "bootstrap/dist/css/bootstrap.css";

function NavBar() {
  return (
    <Nav justify variant="tabs">
      <Nav.Item>
        <LinkContainer to="/clus-vis/">
          <Nav.Link>Home</Nav.Link>
        </LinkContainer>
      </Nav.Item>
      <Nav.Item>
        <LinkContainer to="/clus-vis/preprocessing">
          <Nav.Link>Preprocessing</Nav.Link>
        </LinkContainer>
      </Nav.Item>
      {/* <Nav.Item>
        <LinkContainer to="/clus-vis/preprocessing/keyword">
          <Nav.Link>Keywords</Nav.Link>
        </LinkContainer>
      </Nav.Item> */}
      <Nav.Item>
        <LinkContainer to="/clus-vis/cluster">
          <Nav.Link>Cluster</Nav.Link>
        </LinkContainer>
      </Nav.Item>
    </Nav>
  );
}

export default NavBar;
