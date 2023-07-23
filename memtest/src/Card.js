/*
On fait un jeu du Memory, le composant de base qui sera affiché est donc la carte, elle devra être soit visible, soit présentée de dos (masquée). On part du principe que le 
composant <Card /> recevra 2 props : carrd, qui sera le symbole à afficher et "feedback" qui indiquera l'état visuel de la carte : masquée ou visible.

- On déstructure directement les props passée en arguments. 

- Comme la fonction renvoie directement une grappe de DOM virutle, sans calcul préalable, on se dispense des accolades de bloc et du "return" pour renvoyer directement l'expression : 
on trouve des parenthèses autour du JSX. 

- La syntaxe de valeur textuelle pour une prop ne permet pas l'incrustation de contenu dynamique dans le texte, on a donc recours pour le <div> principal à une expression JSX entre 
accolades, qui, peut utiliser la syntaxe strings d'ES2015, entre backquotes (`), pour incruster dynamiquement la valeur de "feedback".
*/

// On va utiliser une fonction, donc il faut ajouter la proprété "propTypes".
import PropTypes from 'prop-types'
import React from 'react'

import './Card.css'

const HIDDEN_SYMBOL = '❓'

/*
On implémente la prop "onClick dans le composant <Card />.
Ensuite, le composant peut renvoyer l'index de la carte dans la gestion de clic, sans oublier de la déstructurer depuis ses props et de déclarer la prop dans ses prototypes.
A présent, si on clique sur la première carte, elle doit s'afficher sans effet particulier mais si on clique sur une deuxième carte, la méthod "handleNewPairClosedBy()" n'étant 
pas encore écrite, une erreur sera générée, cette méthode manquante sera écrit dans App.js.
*/
const Card = ({ card, feedback, index, onClick }) => (
  <div className={`card ${feedback}`} onClick={() => onClick(index)}>
    <span className="symbol">
      {feedback === 'hidden' ? HIDDEN_SYMBOL : card}
    </span>
  </div>
)

Card.propTypes = {
  card: PropTypes.string.isRequired,
  feedback: PropTypes.oneOf([
    'hidden',
    'justMatched',
    'justMismatched',
    'visible',
  ]).isRequired,
  index: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
}

export default Card
