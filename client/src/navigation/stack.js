import { Routes, Route, BrowserRouter } from "react-router-dom";
import { WebSocketProvider, WebSocketContext } from '../contexts/webSocketContext';
import React from "react";
import ManageNodesList from "../pages/ManageNodes/ManageNodesList";
import InfoPage from "../pages/InfoPage/InfoPage";
import ConnectANodePage from "../pages/ConnectANode/ConnectANodePage";

export default function Stack() {
    return (
      <WebSocketProvider>
        <SocketedStack />
      </WebSocketProvider>
    );
}

function SocketedStack(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={< ManageNodesList />} />
                <Route path="/:node" element = { < InfoPage />} />
                <Route path="/connecting" element = { <ConnectANodePage/> } />
            </Routes>
        </BrowserRouter>
    )
}


  