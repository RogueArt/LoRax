import React from 'react';
import '../styles/Header.scss';
import PropTypes from 'prop-types';
import Arrow from '../styles/imports/arrow.svg'
import { Link } from "react-router-dom";

function Header({ title = 'Backyard Kipling', signalStatus = '', disableBackButton=false }) {
    return (
        <header>
            <Link to="/">
                <div className="back-button" style={disableBackButton ? { display: 'none' } : {}}>
                    <img className="arrow" src={Arrow}/>
                </div>
            </Link>
            <div className="header-text">
                <h1 style={{ margin: 0 }}>{title}</h1>
                {signalStatus ? <h6>Signal Strength: <strong>{signalStatus}</strong></h6> : null}                
            </div>
        </header>
    );
}

Header.propTypes = {
    title: PropTypes.string,
    signalStatus: PropTypes.string,
}

export default Header;