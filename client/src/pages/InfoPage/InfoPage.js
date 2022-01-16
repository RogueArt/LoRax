// import React, {useState} from 'react';
import React from 'react';
import InfoApp from './InfoApp';
import Header from '../../components/Header';
import {useParams} from "react-router-dom"

export default function InfoPage() {   
    const { node } = useParams();
    return <>
      <Header title={urlMap[node]} signalStatus={'Good'} />
      <InfoApp />
    </>
}

const urlMap = {
  "kipling" : "Backyard Kipling",
  "margaret" : "Margaret Atwood"
}