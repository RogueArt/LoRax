// import React, {useState} from 'react';
import React from 'react';
import InfoApp from './InfoApp';
import Header from '../../components/Header';

export default function InfoPage() {   
    return <>
      <Header title={'Backyard Kipling'} signalStatus={'Good'} />
      <InfoApp />
    </>
}