import React from "react";
import PropTypes from "prop-types";
import '../styles/NodeCard.scss';
import Arrow from '../styles/imports/arrow.svg'

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
    function getCardType(issues) {
        return issues >= 1 ? 'warning' : 'normal'
    }

    return <div className={`node-card node-card--${getCardType(issues)}`}>
        <div className="node-card__info">
            <h1 className="node-card__title">{ name }</h1>
            <p className="node-card__signal">Signal Strength: { signal }</p>
            <p className="node-card__sensor-issue">{ numberToIssuesString(issues) }</p>
        </div>
        <div className="node-card__arrow-container">
            <img src={Arrow} />
        </div>
    </div>
}

NodeCard.propTypes = {
    name: PropTypes.string,
    signal: PropTypes.string,
    issues: PropTypes.number,
};

export default NodeCard;