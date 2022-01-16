import React from 'react';
import NodeCard from "../../components/NodeCard.js";
import { Link } from "react-router-dom";
import Header from "../../components/Header.js";
import "../../styles/NodeCard.scss";

function ManageNodesList() {
    return (
        <>
            <Header title="Manage Connections" disableBackButton/>
            <main className={'node-card-list'}>
                <Link to="/kipling">
                <NodeCard
                    name="Backyard Kipling"
                    signal="Good"
                    issues={1}
                />
                </Link>
                <Link to="/margaret">
                <NodeCard
                    name="Margaret Atwood"
                    signal="Poor"
                    issues={0}
                />
                </Link>

                <div className="btn-container">
                    <button>Edit Nodes</button>
                </div>
                <Link to="/connecting">
                <div className="btn-container">
                    <button>Connect Node</button>
                </div>
                </Link>
            </main>
        </>
    );
}

export default ManageNodesList;