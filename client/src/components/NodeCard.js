import React from "react";
import PropTypes from "prop-types";

function numberToIssuesString(issues) {
    switch (issues) {
        case 0:
            return "This area is all good!";
        case 1:
            return "One area needs your attention.";
        case 2:
            return "Two areas need your attention.";
        case 3:
            return "Three areas need your attention.";
        case 4:
            return "Four areas need your attention.";
    }
}

function NodeCard({name, signal, issues}) {
    return <div>
        <div>
            <h1>{ name }</h1>
            <p>Signal Strength: { signal }</p>
            <p>{ numberToIssuesString(issues) }</p>
        </div>
        <div>
            <img src="../styles/imports/arrow.svg"/>
        </div>
    </div>
}

NodeCard.propTypes = {
    name: PropTypes.string,
    signal: PropTypes.bool,
    issues: PropTypes.number,
};

export default NodeCard;