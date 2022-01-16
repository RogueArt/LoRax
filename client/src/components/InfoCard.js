import React from 'react';
import PropTypes from 'prop-types';
import classNames from "classnames";
import '../styles/InfoCard.scss';

function InfoCard({ warning, title, smaller, value }) {
    return (
        <div className={classNames({
            "info-card": true,
            "warning": Boolean(warning),
        })}>
            <h3>{title}</h3>
            <h1 className={classNames({
                "smaller": smaller,
            })}>{value }</h1>
            <p>{warning}</p>
        </div>
    )
}

InfoCard.propTypes = {
    title: PropTypes.string,
    smaller: PropTypes.bool,
    value: PropTypes.string,
    warning: PropTypes.string,
}

export default InfoCard;