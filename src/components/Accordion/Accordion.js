import React, { useState, useRef } from "react";
import Chevron from "./Chevron";

import "./Accordion.css";

// Function that defines the accordion button
function Accordion(props) {

    // Active desactive behavior
    const [setActive, setActiveState] = useState("");
    const [setHeight, setHeightState] = useState("0px");
    const [setRotate, setRotateState] = useState("accordion__icon");
    const [setSubtitle, setSubtitleState] = useState("accordion__subtitle");
    const content = useRef(null);

    function toggleAccordion() {
        // Changes the state of the accordion as a name
        setActiveState(setActive === "" ? "activated" : "");
        // Changes the height of the content by heght prop name
        setHeightState(
            setActive === "activated" ? "0px" : `${content.current.scrollHeight}px`
        );
        // Changes the state of the subtitle
        setSubtitleState(
            setActive === "activated" ? "accordion__subtitle" : 'accordion__subtitle__hidden'
        );
        // Makes that chevron icon rotates
        setRotateState(
            setActive === "activated" ? "accordion__icon" : "accordion__icon rotate"
        );
    }

    return (
        <div className="accordion__section">
        {/* Accordion's principal button */}
            <button className={`accordion ${setActive}`} onClick={toggleAccordion}>
            {/* Title of the accordion */}
                <div className="accordion__icon icon__button">{ props.icon }</div>
                <div>
                    <p className="accordion__title">{props.title}</p>
                    <p className={`${setSubtitle}`}>{ props.subMenus }</p>
                </div>
                {/* Icon */}
                <Chevron className={`${setRotate}`} width={10} fill={"#768597"} />
            </button>
            {/* Content */}
            <div
            ref={content}
            style={{ maxHeight: `${setHeight}` }}
            className="accordion__content">
                <div className="accordion__text">
                    {props.content}
                </div>
            </div>
        </div>
    );
}

export default Accordion;
