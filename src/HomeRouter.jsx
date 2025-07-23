import React from 'react';
import Login from './Login';
import MenuMetodos from './MenuMetodos';

export default function HomeRouter() {
  const gafete = localStorage.getItem('gafete');
  if (gafete) {
    return <MenuMetodos />;
  } else {
    return <Login />;
  }
}
