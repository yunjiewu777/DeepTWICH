import React from "react";
import { Link } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import { LinkContainer } from "react-router-bootstrap";
import "bootstrap/dist/css/bootstrap.css";

function NavBar() {
  return (
    <Nav justify variant="tabs" defaultActiveKey="/">
      <Nav.Item>
        <LinkContainer to="/">
          <Nav.Link>Home</Nav.Link>
        </LinkContainer>
      </Nav.Item>

      <Nav.Item>
        <LinkContainer to="/elimination">
          <Nav.Link>Elimination</Nav.Link>
        </LinkContainer>
      </Nav.Item>

      <Nav.Item>
        <LinkContainer to="/preprocessing">
          <Nav.Link>Preprocessing</Nav.Link>
        </LinkContainer>
      </Nav.Item>

      <Nav.Item>
        <LinkContainer to="/cluster">
          <Nav.Link>Cluster</Nav.Link>
        </LinkContainer>
      </Nav.Item>
    </Nav>
  );
}

export default NavBar;
