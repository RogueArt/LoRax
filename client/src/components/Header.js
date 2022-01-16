import React from 'react';
import '../styles/Header.scss';

class Header extends React.Component {
    render() {
        return (
            <header>
                <div>
                </div>
                <div className="header-text">
                    <h1>
                        Backyard Kipling
                    </h1>
                    <h6>Signal Strength: <strong>Good</strong></h6>
                </div>
            </header>
        );
    }
}

export default Header;