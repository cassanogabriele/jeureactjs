// Premier composant avec styles et tests.

/*
Ecriture du composant Application 
*********************************
Il est le composant principal, il est définit par une classe et non par une simple fonction.

- Le mot-clé "class" permet de définir un corps de classe dont les éléments : constructeurs, méthodes, etc n'ont pas besoin d'être séparés par des virgules.
- Le mot-clé "extends" spécialise la classe par héritage.

- La carte est masquée (hidden).
- La carte fait partie de la tentive en cours qui vient de réussir une paire (justMatched).
- La carte appartient à une paire précédemment réussie (visible)
*/
import React, { Component } from 'react'
import shuffle from 'lodash.shuffle'

import './App.css'

import Card from './Card'
import GuessCount from './GuessCount'
// On va afficher le tableau d'honneur à la place de "GAGNE".
import HallOfFame, { FAKE_HOF } from './HallOfFame'
import HighScoreInput from './HighScoreInput'

// Affichage du plateau de cartes.
const SIDE = 6
const SYMBOLS = 'ðŸ˜€ðŸŽ‰ðŸ’–ðŸŽ©ðŸ¶ðŸ±ðŸ¦„ðŸ¬ðŸŒðŸŒ›ðŸŒžðŸ’«ðŸŽðŸŒðŸ“ðŸðŸŸðŸ¿'
const VISUAL_PAUSE_MSECS = 750

class App extends Component {
	/* 
	Gestion d'un étal local 
	***********************
	Tout l'état courant du jeu est stocké comme état local dans ce composant racine. On commence par rempacer le champ temporaire "cards" par une initialisation du 
	champ officiel "state". Pour l'instant, on affiche tout le temps ou presque et avec les mauvaises données, on va donc modifier la partie conditionnelle du JSX en 
	bas du render(), en allant chercher une nouvell information dans l'état local : hallOfFame, qui serait le tableau d'honneur à jour.
	*/
	state = {
		cards: this.generateCards(),
		// tableau réprésenant la paire en cours de sélection par la joueuse. A vide, il n'y a aucune sélection en cours. Un élement signifie qu'une première carte à été 
		// retournée, deux éléments signifient qu'on a retourné une seconde carte, ce qui déclenchera une analyse de la paire et l'avancée éventuelle de la parie.
		currentPair: [],
		// nombre de tentatives de la partie en cours : nombre de paires tentées, pas le nombre de clics.
		guesses: 0,
		// liste les positions des cartes appartenant aux paires déjà réussies et donc visibles de façon permanente.
		matchedCardIndices: [],
	}
	
	// On ajoute une méthode qui va recevoir un tableau d'honneur et qui en ajustera l'état.
	displayHallOfFame = (hallOfFame) => {
		this.setState({ hallOfFame })
	}
	
	// On initialise un champs "cards" dans le composant avec une liste mélangée de paires de cartes.
	cards = this.generateCards()

	generateCards() {
		const result = []
		const size = SIDE * SIDE
		const candidates = shuffle(SYMBOLS)
		while (result.length < size) {
		  const card = candidates.pop()
		  result.push(card, card)
		}
    
		return shuffle(result)
	}
	
	// On dispose mainteant d'un état qui décrit l'avancement du jeu, il faut donc arrêter d'afficher de base toute les cartes.
	getFeedbackForCard(index) {
		// On utilise "this" pour aller consulter l'état mais comme on appelle cette méthode directement et non pas par référence, on n'a pas besoin de garantir 
		// le "this" avec une syntaxe à base d'initialiseur. On va donc l'appeler dans le render() et on verra à présent toutes les cartes cachées, l'état initial 
		// n'ayant aucune position dans "matchedCardIndices". Il faut maintenant faire évoluer l'état au fil des clics, en commençant par le champ d'état currentPair
		// qui permet de constituer la paire actuellement tentée.		
		const { currentPair, matchedCardIndices } = this.state
		const indexMatched = matchedCardIndices.includes(index)

		if(currentPair.length < 2) {
			return indexMatched || index === currentPair[0] ? 'visible' : 'hidden'
		}

		if (currentPair.includes(index)) {
			return indexMatched ? 'justMatched' : 'justMismatched'
		}
		
		return indexMatched ? 'visible' : 'hidden'
	}
	
	// Réaction à un événement : on met une méthode métier sur le composant applicatif. 
	
	/*handleCardClick(card){
		console.log(card, this)
	};*/

	// Cette méthode va avoir besoin de "this" et pour le moment cela pose problème. Puisque Create React App ne permet pas pour le moment de recourir aux décorateurs, on 
	// va utiliser la syntaxe à base d'initialiseur à la volée.
	/*handleCardClick = (card) => {
		console.log(card, this)
	}*/
	
	// On va donc de nouveau modifier le "handleCardClick" : c'est désormais l'index de la carte et non son symbole, qui est ambigu car il est présente deux fois, qui est 
	// intéressant, il faut commencer par fournir cette informations au composant "card".
	handleCardClick = index => {
		const { currentPair } = this.state

		 if(currentPair.length === 2) {
			return
		}

		if(currentPair.length === 0) {
			this.setState({ currentPair: [index] })
			return
		}

		this.handleNewPairClosedBy(index)
	}
	
	handleWinnerUpdate = (event) => {
		this.setState({ winner: event.target.value.toUpperCase() })
	}

	/*
	Cette méthode permet d'abitrer la paire fraîchement constituée et de faire avancer la partie. Il y a de multiples appels à "this.setState()", qui se préoccupent de divers champs, 
	et ils seront tous en réalité exécuté d'un bloc avant le prochain "render()", au moment le plus opportun.
	*/
	handleNewPairClosedBy(index) {
		const { cards, currentPair, guesses, matchedCardIndices } = this.state
		const newPair = [currentPair[0], index]
		const newGuesses = guesses + 1
		const matched = cards[newPair[0]] === cards[newPair[1]]
		
		this.setState({ currentPair: newPair, guesses: newGuesses })
		
		if (matched) {
			this.setState({ matchedCardIndices: [...matchedCardIndices, ...newPair] })

		}
		setTimeout(() => this.setState({ currentPair: [] }), VISUAL_PAUSE_MSECS)
	}
	
	/*
	Le début de la méthode render() va donc changer : elle va aller chercher les infos uties dans l'état local courant et les utiliser pour les props et pour la source de la liste 
	de cartes.	
	*/
	render() {
		const { cards, guesses, hallOfFame, matchedCardIndices } = this.state
		// On affiche en bas du plateau "GAGNE" uniquement quand le nombre de seconde de l'heure courante est paire.
		// const won = new Date().getSeconds() % 2 === 0
		
		// La définition de "won" n'est plus un simulacre fondé sur le moment présent mais vient du fait que toutes les cartes ont été retournées de façon permanente. 
		const won = matchedCardIndices.length === cards.length
			
		// Et on met un événement onClick sur les composant Card.
		// Affichage de la liste de toutes les cartes visibles pour le moment.
		
		/*
		Pour éviter d'avoir à gagner une partie chaque fois qu'on recharge la page pour mettre au point le composant, on modifie le render 
		
		<HighScoreInput guesses={guesses} />
		{won && <HallOfFame entries={FAKE_HOF} />}
		
		On ajoute un gestionnaire de saisie qui va rendre éditable le champ du HighScoreInput, l'idée est de forcer une saisie majusucle comme sur les vieilles bornes d'arcade.
		
		Modification du bloc "won"
		**************************
		- sans fin de partie, aucune affichage possible 
		- si "won" est à true, on regarde si on dispose d'un tableau d'honneur, ce qui signifie qu'on a déjà procédé à la saisie du nom, sinon on affiche le tableau en se basant 
		  sur ces données 
		- faute de tableau : on a pas encore saisi le nom, on utilise donc le composant de saisie, en passant le displayHallOfFame() comme fonction de rappel une fois le tableau 
		  à jour et persisté.
		*/
		
		return (
			<div className="memory">
			<GuessCount guesses={guesses} />
			
			{cards.map((card, index) => (
			  <Card
				card={card}
				feedback={this.getFeedbackForCard(index)}
				index={index}
				key={index}
				onClick={this.handleCardClick}
			  />
			))}
			
			<HighScoreInput guesses={guesses} />			
			
			{
				won &&
					(hallOfFame ? (
						<HallOfFame entries={hallOfFame} />

					) : (
						<HighScoreInput guesses={guesses} onStored={this.displayHallOfFame} />
					))
			}			
		  </div>
		)
	  }
}

export default App
