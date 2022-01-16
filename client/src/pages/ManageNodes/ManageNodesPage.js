// import React, {useState} from 'react';
import React from 'react';
import ManageNodesList from './ManageNodesList';
import Header from '../../components/Header';

export default function ManageNodes() {   
    return <>
      <Header title={'Manage Connections'} />
      <ManageNodesList />
    </>
}