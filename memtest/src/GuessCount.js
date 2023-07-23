/*
Ecriture du composant Compteur de tentatives 
********************************************
Au fil de la parite, on l'affichera avant le plateau de cartes, il attend juste une "prop" nommée "guesses".
*/

// On suit le même principe que pour le composant Car, pour l'unique prop "guesses", numérique.
import PropTypes from 'prop-types'
import React from 'react'

import './GuessCount.css'

const GuessCount = ({ guesses }) => <div className="guesses">{guesses}</div>

GuessCount.propTypes = {
  guesses: PropTypes.number.isRequired,
}

export default GuessCount
