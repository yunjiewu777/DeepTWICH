import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import Nav from "react-bootstrap/Nav";
import { LinkContainer } from "react-router-bootstrap";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import NumForm from "../components/eli/num_form";
import Reg from "../components/eli/reg";
import RegForm from "../components/eli/reg_form";
import EliTweets from "../components/eli/eli_tweets";
import distinctColors from "distinct-colors";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";

function Elimination() {
  const [regs, setRegs] = useState([]);
  const [editedReg, setEditedReg] = useState(null);
  const [tweets, setTweets] = useState(null);
  const [palette, setPalette] = useState(null);

  useEffect(() => {
    setPalette(
      distinctColors({
        count: regs.length,
        chromaMin: 30,
        chromaMax: 80,
        lightMin: 35,
        lightMax: 80,
      })
    );
  }, [regs]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/elimination/get_reg", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => resp.json())
      .then((resp) => {
        setRegs(resp);
      })
      .catch((error) => console.log(error));
  }, []);

  // useEffect(() => {
  //   fetch("http://127.0.0.1:5000/elimination/get_random", {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   })
  //     .then((resp) => resp.json())
  //     .then((resp) => setTweets(resp))
  //     .catch((error) => console.log(error));
  // }, []);

  const editReg = (reg) => {
    console.log("editReg");
    setEditedReg(reg);
  };

  const insertedReg = (reg) => {
    const new_reg = [...regs, reg];
    setRegs(new_reg);
  };

  const deleteReg = (reg) => {
    const new_reg = regs.filter((my_reg) => {
      if (my_reg.id === reg.id) {
        return false;
      }
      return true;
    });
    setRegs(new_reg);
  };

  const getTweets = (tweets) => {
    setTweets(tweets);
  };

  const updatedReg = (reg) => {
    const new_reg = regs.map((my_reg) => {
      if (my_reg.id === reg.id) {
        return reg;
      } else {
        return my_reg;
      }
    });
    setRegs(new_reg);
  };

  const openForm = () => {
    setEditedReg({ name: "", reg: "" });
  };

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
          <div
            style={{ height: "650px" }}
            class="col-4 border border-primary container"
          >
            {palette && palette.length === regs.length && (
              <Reg
                regs={regs}
                editReg={editReg}
                deleteReg={deleteReg}
                palette={palette}
                openForm={openForm}
                updatedReg={updatedReg}
              />
            )}

            <br />

            {editedReg ? (
              <RegForm
                Reg={editedReg}
                updatedReg={updatedReg}
                insertedReg={insertedReg}
              />
            ) : null}
          </div>

          <div class="col-8 border border-primary">
            <Container>
              <NumForm getTweets={getTweets} />
              <hr />

              <EliTweets tweets={tweets} regs={regs} palette={palette} />

              <br />

              <div className="row">
                <div className="col-8">
                  <Accordion>
                    <AccordionSummary
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography>Instruction</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography style={{ textAlign: "left" }}>
                        In the left panel, you can edit existing regular
                        expressions or add new words/phrases/regular expressions
                        you want to eliminate by defining a name and then
                        inputting regular expressions. By checking the box on
                        the left of each entry, you select the words/phrases you
                        want to eliminate. If you hover over the name of the
                        entry that you defined, you can see the corresponding
                        regular expression you entered. The right panel shows
                        random tweets of which number you can enter in the top
                        textbox. These tweets will be highlighted in
                        corresponding words/phrases that you choose to eliminate
                        in the left panel. By hovering over the highlighted
                        text, you can see the elimination’s name.
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                </div>
                <div className="col-4">
                  <button className="btn btn-primary">
                    <LinkContainer to="/clus-vis/preprocessing/keyword">
                      <Nav.Link>Save & Next Step</Nav.Link>
                    </LinkContainer>
                  </button>

                  {/* onclick="location.href='http://www.example.com'" */}
                </div>
              </div>
            </Container>
          </div>
        </Row>
      </Container>
    </div>
  );
}

export default Elimination;
