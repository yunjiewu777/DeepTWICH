import React from "react";
import NavBar from "../components/NavBar";
import Nav from "react-bootstrap/Nav";
import { LinkContainer } from "react-router-bootstrap";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Scatter from "../components/scatter";

function Cluster() {
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

      <Container>
        <Row>
          <div class="col-3 border border-primary container">
            <div class="border border-primary">
              {["Emoji", "URL", "Hash Tags", "@"].map((expression) => (
                <div>
                  <h6 class="text-left">{expression}</h6>
                  <p class="text-left">
                    Some quick example text to build on the.
                  </p>
                </div>
              ))}
            </div>
            <Form.Select aria-label="Default select example">
              <option>Select Clustering Methods</option>
              <option value="1">KMeans</option>
              <option value="2">Affinity Propogation</option>
            </Form.Select>
          </div>
          <div class="col-6 border border-primary">
            <Container>
              <Scatter />
              <Button variant="primary" size="sm">
                Re-Cluster
              </Button>{" "}
              <br></br>
            </Container>
          </div>
          <div class="col-3 border border-primary container">
            <div class="border border-primary">
              {["Emoji", "URL", "Hash Tags", "@"].map((expression) => (
                <div>
                  <p class="text-left">Contextual Tweets.</p>
                </div>
              ))}
            </div>
            <div className="border border-primary justify-content-start">
              <ButtonGroup size="sm">
                <Button variant="primary">Positive</Button>
                <Button variant="danger">Negative</Button>
                <Button variant="warning">Warning</Button>
              </ButtonGroup>
            </div>
          </div>
        </Row>
      </Container>
      <h1>Welcome to Cluster Page!</h1>
    </div>
  );
}

export default Cluster;
