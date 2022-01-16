import React from 'react';
import PropTypes from 'prop-types';
import classNames from "classnames";
import '../styles/InfoCard.scss';

class InfoCard extends React.Component {
    render() {
        return (
            <div className={classNames({
                "info-card": true,
                "warning": this.props.warning !== undefined && this.props.warning !== "",
            })}>
                <h3>{ this.props.title }</h3>
                <h1 className={classNames({
                    "smaller": this.props.smaller,
                })}>{ this.props.value }</h1>
                <p>{this.props.warning}</p>
            </div>
        )
    }
}

InfoCard.propTypes = {
    title: PropTypes.string,
    smaller: PropTypes.bool,
    value: PropTypes.string,
    warning: PropTypes.string,
}

export default InfoCard;