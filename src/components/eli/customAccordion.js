import React, { useState, useEffect } from "react";
import AccordionButton from "react-bootstrap/AccordionButton";
import AccordionContext from "react-bootstrap/AccordionContext";

export default class CustomAccordion extends React.Component {
  state = { show: false };
  toggle = () => this.setState({ show: !this.state.show });
  render() {
    const { title, children } = this.props;
    const { show } = this.state;
    return (
      <div>
        <AccordionButton onClick={this.toggle}>{title}</AccordionButton>
        {show && (
          <AccordionContext>
            <p>{children}</p>
          </AccordionContext>
        )}
      </div>
    );
  }
}
