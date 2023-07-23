import PropTypes from 'prop-types'
import React, { Component } from 'react'

import './HighScoreInput.css'

import { saveHOFEntry } from './HallOfFame'

// Pour l'instant on a un formulaire qui s'affiche en parmanence, on va contrôler le champ, on va doter <HighScoreInput /> d'un état local pour la valeur de nom saisie.

/*
On va ensuite intercepter l'envoi du fomulaire : on va traiter l'événement submit du formulaire qui sera déclenché quel que soit la manipulation utilisée (Enter dans le champs, clic 
sur le bouton, touche Espace sur le bouton).
*/
class HighScoreInput extends Component {
	constructor(props) {
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.input = React.createRef();
	}
	
	handleSubmit(event) {
		alert('Quel est le nom du gagnant ? : ' + this.input.current.value);
		event.preventDefault();
	}
	
	/*
	On définit la méthode métier, fournie par référence, elle doit donc garantir son "this" pour pouvoir manipuler "state". La fonction saveHOFEntry() est fournie par le HallOfFame.js 
	qu'on a récupéré avant, elle attend une fonction de rappel en second argument, quelle appelera dans le tableau d'honneur à jour une fois qu'il est ajusté et persisté dans le navigateur.
	*/
	render() {	  
		return (
			<form onSubmit={this.handleSubmit}>
				<label>
					<p>Vous êtes le gagnant. </p>			 
					<p>Entrez votre nom : &nbsp;</p>
					<input type="text" ref={this.input} />
				</label>
				
				<p><input type="submit" value="Submit" /></p>
			</form>		
		)		
	}
}

export default HighScoreInput
