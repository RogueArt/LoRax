import React from 'react';
import '../styles/Header.scss';
import PropTypes from 'prop-types';

function Header({ title = 'Backyard Kipling', signalStatus = '' }) {
    return (
        <header>
            <div>
            </div>
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