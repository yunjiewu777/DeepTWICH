import React from "react";
import NavBar from "../components/NavBar";
import Nav from "react-bootstrap/Nav";
import { LinkContainer } from "react-router-bootstrap";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import RSChart from "../components/barchart";
import V_BarChart from "../components/v_barchart";

function Keyword() {
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

      <Container>
        <Row>
          <div class="col-3 border border-primary container">
            <V_BarChart />
            <V_BarChart />
          </div>
          <div class="col-6 border border-primary">
            <Container>
              <div>
                {["Emoji", "URL", "Hash Tags", "@"].map((expression) => (
                  <div>
                    <Card border="secondary">
                      <Card.Body>
                        <Card.Text>
                          Some quick example text to build on the card title and
                          make up the bulk of the card's content.
                        </Card.Text>
                      </Card.Body>
                    </Card>
                    <br />
                  </div>
                ))}
              </div>
              <div>
                <Row>
                  <Col xs={8}>
                    <p>Number of Tweets Annotated: 123</p>
                  </Col>
                  <Col xs={4}>
                    <Button variant="primary" size="sm">
                      Test
                    </Button>{" "}
                  </Col>
                </Row>
                <br></br>
              </div>
            </Container>
            {/* </div> */}
          </div>
          <div class="col-3 border border-primary container">
            <RSChart />
          </div>
        </Row>
      </Container>
      <h1>Welcome to Keyword SubPage!</h1>
    </div>
  );
}

export default Keyword;
