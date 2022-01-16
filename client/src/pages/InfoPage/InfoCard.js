import React from 'react';
import PropTypes from 'prop-types';
import classNames from "classnames";
import '../../styles/InfoCard.scss';

function InfoCard({ warning, title, smaller, value }) {
    function formatValue(value, title) {
        if (value === '-') return '-'

        const numVal = Math.round(value)
        if (title === 'Temperature') return tempC2F(numVal)
        if (title === 'Soil Moisture') {
            const normalizedSMUnit = Math.round(value / 2000)
            return normalizedSMUnit + '%'
        }
        if (title === 'UV Light') {
            const normalizedUVUnit = value / 65535
            if (normalizedUVUnit <= 20) return 'Very Low'
            else if (normalizedUVUnit <= 20 && normalizedUVUnit <= 40) return 'Low'
            else if (normalizedUVUnit <= 40 && normalizedUVUnit <= 60) return 'Normal'
            else if (normalizedUVUnit <= 60 && normalizedUVUnit <= 80) return 'High'
            else return 'Very High'
        }
        if (title === 'Humidity') return numVal + '%'
    }

    function tempC2F(t) {
        if (t === "-") return "-";
        return `${Math.round(t * 9 / 5 + 32)}°F`;
    }
    
    return (
        <div className={classNames({
            "info-card": true,
            "warning": Boolean(warning),
        })}>
            <h3>{title}</h3>
            <h1 className={classNames({
                "smaller": smaller,
            })}>{formatValue(value, title)}</h1>
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