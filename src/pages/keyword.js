import React from "react";
import NavBar from "../components/NavBar";
import Nav from "react-bootstrap/Nav";
import { LinkContainer } from "react-router-bootstrap";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import RSChart from "../components/key/barchart";
import V_BarChart from "../components/key/v_barchart";

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
          <div className="col-3 border border-primary container">
            <V_BarChart
              sample={[
                { model: "bar", score: 50 },
                { model: "salon", score: 20 },
                { model: "beer", score: 10 },
                { model: "mask", score: 1 },
              ]}
            />
            <V_BarChart
              sample={[
                { model: "bar", score: 50 },
                { model: "salon", score: 20 },
                { model: "beer", score: 10 },
                { model: "mask", score: 1 },
              ]}
            />
          </div>

          <div className="col-6 border border-primary">
            <Container
              style={{
                marginTop: "10px",
                overflowY: "scroll",
                height: "400px",
                overflowX: "auto",
              }}
            >
              <div>
                {["Emoji", "URL", "Hash Tags", "@"].map((expression) => (
                  <div>
                    <Card border="secondary">
                      <Card.Body>
                        <Card.Text>
                          Just posted a video @ Cashmere Faces Glam Bar &amp;
                          Salon https://t.co/B2fpL7ucL0
                        </Card.Text>
                      </Card.Body>
                    </Card>
                    <br />
                  </div>
                ))}
              </div>
            </Container>
            <br />
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
              <br />
            </div>
            {/* </div> */}
          </div>
          <div className="col-3 border border-primary container">
            <RSChart />
          </div>
        </Row>
      </Container>
      {/* <h1>Welcome to Keyword SubPage!</h1> */}
    </div>
  );
}

export default Keyword;
