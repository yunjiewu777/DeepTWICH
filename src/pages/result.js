import React from "react";
import NavBar from "../components/NavBar";
import Nav from "react-bootstrap/Nav";
import { LinkContainer } from "react-router-bootstrap";

function Result() {
  return (
    <div>
      <NavBar></NavBar>

      <Nav justify variant="tabs" defaultActiveKey="/">
        <Nav.Item>
          <LinkContainer to="/clus-vis/cluster">
            <Nav.Link>Cluster Refine</Nav.Link>
          </LinkContainer>
        </Nav.Item>
        <Nav.Item>
          <LinkContainer to="/clus-vis/cluster/result">
            <Nav.Link>Whole View</Nav.Link>
          </LinkContainer>
        </Nav.Item>
      </Nav>

      <h1>Result! Under Development</h1>
    </div>
  );
}

export default Result;
