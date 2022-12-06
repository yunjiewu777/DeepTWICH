import React from "react";
import Card from "react-bootstrap/Card";

function EliTweets(props) {
  function highlightPattern(text) {
    // console.log(text);

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

    // console.log(indexes);

    indexes = [...indexes].sort((a, b) => a.index - b.index);

    // console.log(indexes);

    let result = [];
    let cur_index = 0;

    // console.log("creating");
    indexes.map((currElement, index) => {
      const color = props.palette[currElement.reg_index];
      // console.log(color);

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

      // console.log(currElement.text.length);
      cur_index = cur_index + currElement.text.length;

      // if (
      //   index == result.length - 1 &&
      //   currElement.index + currElement.text.length != text.length
      // ) {
      //   console.log(currElement.text);
      //   console.log(index);
      //   result = [
      //     ...result,
      //     text.substring(
      //       currElement.index + currElement.text.length,
      //       text.length
      //     ),
      //   ];
      // }
    });

    if (cur_index < text.length) {
      result = [...result, text.substring(cur_index, text.length)];
    }

    // let i = 0;
    // while (i < text.length) {}

    // console.log(result);

    return result;

    // console.log(splitText);

    // let result = splitText.reduce((arr, element, index) => {
    //   console.log(arr, element, index, matches[index]);
    // });

    // let result = splitText.reduce(
    //   (arr, element, index) =>
    //     matches[index]
    //       ? [
    //           ...arr,
    //           element,
    //           <mark style={{ backgroundColor: "purple" }} key={index}>
    //             {matches[index]}
    //           </mark>,
    //         ]
    //       : [...arr, element],
    //   []
    // );

    // console.log(result);
  }

  return (
    <div style={{ overflowY: "scroll", height: "475px" }}>
      {/* <Card border="secondary">
        <Card.Body>
          <Card.Text>
            <Highlighter
              highlightClassName="YourHighlightClass"
              searchWords={[/http/]}
              autoEscape={true}
              textToHighlight="Salon https://t.co/uImwtgk66O"
            />
          </Card.Text>
        </Card.Body>
      </Card> */}

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

// import { useState, useEffect } from "react";

{
  /* {typeof data === "undefined" ? (
                  <p>Loading...</p>
                ) : (
                  Object.entries(data).map(([key, value]) => (
    
                  ))
                )} */
}
{
  /* <div key={reg.id}>
              <div className="row">
                <div className="col">
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      value=""
                      id="flexCheckDefault"
                    ></input>
                    <label class="form-check-label" for="flexCheckDefault">
                      {reg.id}
                    </label>
                  </div>
                </div>
                <div className="col">
                  <button
                    onClick={() => editReg(reg)}
                    className="btn btn-primary"
                    size="sm"
                  >
                    Edit
                  </button>{" "}
                </div>
                <div className="col">
                  <button className="btn btn-danger" size="sm">
                    Delete
                  </button>
                </div>
              </div> */
}

{
  /* <h2>{reg.id}</h2>
                <p>{reg.reg}</p>
  
                <div className="row">
                  <div className="col">
                    <button
                      className="btn btn-primary"
                      onClick={() => editReg(reg)}
                    >
                      Update
                    </button>
                  </div>
                  <div className="col">
                    <button className="btn btn-danger">Delete</button>
                  </div>
                </div> */
}
{
  /* <hr />
            </div>
          );
        })} */
}
