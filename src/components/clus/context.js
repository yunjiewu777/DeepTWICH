import React from "react";
import APIService from "../APIService";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import Highlighter from "react-highlight-words";

function Context(props) {
  return (
    <div className="border border-primary">
      <h4>Keyword Context</h4>
      tweets
      <div style={{ overflowY: "scroll", height: "190px" }}>
        {props.contextword
          ? props.context.map((tweet) => (
              <div key={tweet.id}>
                <Card border="secondary">
                  <Card.Body>
                    <Card.Text>
                      <Highlighter
                        highlightClassName="YourHighlightClass"
                        searchWords={[props.contextword]}
                        autoEscape={true}
                        textToHighlight={tweet["text"]}
                      />
                    </Card.Text>
                  </Card.Body>
                </Card>
              </div>
            ))
          : null}
      </div>
    </div>
  );
}

export default Context;
