import React from "react";
import Card from "react-bootstrap/Card";

function EliTweets(props) {
  function highlightPattern(text) {
    let matches = [];
    let indexes = [];

    props.regs.map((reg, index) => {
      if (reg.checked) {
        matches = [...text.matchAll(new RegExp(reg.reg, "g"))];

        matches.map((m) => {
          indexes = [
            ...indexes,
            {
              index: m.index,
              text: m["0"],
              reg_name: reg.name,
              reg_index: index,
            },
          ];
        });
      }
    });

    indexes = [...indexes].sort((a, b) => a.index - b.index);

    let result = [];
    let cur_index = 0;

    indexes.map((currElement, index) => {
      const color = props.palette[currElement.reg_index];

      if (cur_index < currElement.index) {
        result = [...result, text.substring(cur_index, currElement.index)];
        cur_index = currElement.index;
      }

      result = [
        ...result,
        <mark
          style={{
            backgroundColor: `rgba(${color._rgb[0]}, ${color._rgb[1]}, ${color._rgb[2]}, 0.3)`,
          }}
          key={index}
          title={currElement.reg_name}
        >
          {currElement.text}
        </mark>,
      ];

      cur_index = cur_index + currElement.text.length;
    });

    if (cur_index < text.length) {
      result = [...result, text.substring(cur_index, text.length)];
    }

    return result;
  }

  return (
    <div style={{ overflowY: "scroll", height: "475px" }}>
      {props.tweets &&
        props.tweets.map((tweet) => {
          return (
            <div key={tweet.id}>
              <Card border="secondary">
                <Card.Body>
                  <Card.Text>
                    {highlightPattern(tweet.text, /http\S+/g)}
                  </Card.Text>
                </Card.Body>
              </Card>
              <br />
            </div>
          );
        })}
    </div>
  );
}

export default EliTweets;
