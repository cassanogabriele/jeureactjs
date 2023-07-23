// Premier composant avec styles et tests.

/*
Ecriture du composant Application 
*********************************
Il est le composant principal, il est d�finit par une classe et non par une simple fonction.

- Le mot-cl� "class" permet de d�finir un corps de classe dont les �l�ments : constructeurs, m�thodes, etc n'ont pas besoin d'�tre s�par�s par des virgules.
- Le mot-cl� "extends" sp�cialise la classe par h�ritage.

- La carte est masqu�e (hidden).
- La carte fait partie de la tentive en cours qui vient de r�ussir une paire (justMatched).
- La carte appartient � une paire pr�c�demment r�ussie (visible)
*/
import React, { Component } from 'react'
import shuffle from 'lodash.shuffle'

import './App.css'

import Card from './Card'
import GuessCount from './GuessCount'
// On va afficher le tableau d'honneur � la place de "GAGNE".
import HallOfFame, { FAKE_HOF } from './HallOfFame'
import HighScoreInput from './HighScoreInput'

// Affichage du plateau de cartes.
const SIDE = 6
const SYMBOLS = '😀🎉💖🎩🐶🐱🦄🐬🌍🌛🌞💫🍎🍌🍓🍐🍟🍿'
const VISUAL_PAUSE_MSECS = 750

class App extends Component {
	/* 
	Gestion d'un �tal local 
	***********************
	Tout l'�tat courant du jeu est stock� comme �tat local dans ce composant racine. On commence par rempacer le champ temporaire "cards" par une initialisation du 
	champ officiel "state". Pour l'instant, on affiche tout le temps ou presque et avec les mauvaises donn�es, on va donc modifier la partie conditionnelle du JSX en 
	bas du render(), en allant chercher une nouvell information dans l'�tat local : hallOfFame, qui serait le tableau d'honneur � jour.
	*/
	state = {
		cards: this.generateCards(),
		// tableau r�pr�senant la paire en cours de s�lection par la joueuse. A vide, il n'y a aucune s�lection en cours. Un �lement signifie qu'une premi�re carte � �t� 
		// retourn�e, deux �l�ments signifient qu'on a retourn� une seconde carte, ce qui d�clenchera une analyse de la paire et l'avanc�e �ventuelle de la parie.
		currentPair: [],
		// nombre de tentatives de la partie en cours : nombre de paires tent�es, pas le nombre de clics.
		guesses: 0,
		// liste les positions des cartes appartenant aux paires d�j� r�ussies et donc visibles de fa�on permanente.
		matchedCardIndices: [],
	}
	
	// On ajoute une m�thode qui va recevoir un tableau d'honneur et qui en ajustera l'�tat.
	displayHallOfFame = (hallOfFame) => {
		this.setState({ hallOfFame })
	}
	
	// On initialise un champs "cards" dans le composant avec une liste m�lang�e de paires de cartes.
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
	
	// On dispose mainteant d'un �tat qui d�crit l'avancement du jeu, il faut donc arr�ter d'afficher de base toute les cartes.
	getFeedbackForCard(index) {
		// On utilise "this" pour aller consulter l'�tat mais comme on appelle cette m�thode directement et non pas par r�f�rence, on n'a pas besoin de garantir 
		// le "this" avec une syntaxe � base d'initialiseur. On va donc l'appeler dans le render() et on verra � pr�sent toutes les cartes cach�es, l'�tat initial 
		// n'ayant aucune position dans "matchedCardIndices". Il faut maintenant faire �voluer l'�tat au fil des clics, en commen�ant par le champ d'�tat currentPair
		// qui permet de constituer la paire actuellement tent�e.		
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
	
	// R�action � un �v�nement : on met une m�thode m�tier sur le composant applicatif. 
	
	/*handleCardClick(card){
		console.log(card, this)
	};*/

	// Cette m�thode va avoir besoin de "this" et pour le moment cela pose probl�me. Puisque Create React App ne permet pas pour le moment de recourir aux d�corateurs, on 
	// va utiliser la syntaxe � base d'initialiseur � la vol�e.
	/*handleCardClick = (card) => {
		console.log(card, this)
	}*/
	
	// On va donc de nouveau modifier le "handleCardClick" : c'est d�sormais l'index de la carte et non son symbole, qui est ambigu car il est pr�sente deux fois, qui est 
	// int�ressant, il faut commencer par fournir cette informations au composant "card".
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
	Cette m�thode permet d'abitrer la paire fra�chement constitu�e et de faire avancer la partie. Il y a de multiples appels � "this.setState()", qui se pr�occupent de divers champs, 
	et ils seront tous en r�alit� ex�cut� d'un bloc avant le prochain "render()", au moment le plus opportun.
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
	Le d�but de la m�thode render() va donc changer : elle va aller chercher les infos uties dans l'�tat local courant et les utiliser pour les props et pour la source de la liste 
	de cartes.	
	*/
	render() {
		const { cards, guesses, hallOfFame, matchedCardIndices } = this.state
		// On affiche en bas du plateau "GAGNE" uniquement quand le nombre de seconde de l'heure courante est paire.
		// const won = new Date().getSeconds() % 2 === 0
		
		// La d�finition de "won" n'est plus un simulacre fond� sur le moment pr�sent mais vient du fait que toutes les cartes ont �t� retourn�es de fa�on permanente. 
		const won = matchedCardIndices.length === cards.length
			
		// Et on met un �v�nement onClick sur les composant Card.
		// Affichage de la liste de toutes les cartes visibles pour le moment.
		
		/*
		Pour �viter d'avoir � gagner une partie chaque fois qu'on recharge la page pour mettre au point le composant, on modifie le render 
		
		<HighScoreInput guesses={guesses} />
		{won && <HallOfFame entries={FAKE_HOF} />}
		
		On ajoute un gestionnaire de saisie qui va rendre �ditable le champ du HighScoreInput, l'id�e est de forcer une saisie majusucle comme sur les vieilles bornes d'arcade.
		
		Modification du bloc "won"
		**************************
		- sans fin de partie, aucune affichage possible 
		- si "won" est � true, on regarde si on dispose d'un tableau d'honneur, ce qui signifie qu'on a d�j� proc�d� � la saisie du nom, sinon on affiche le tableau en se basant 
		  sur ces donn�es 
		- faute de tableau : on a pas encore saisi le nom, on utilise donc le composant de saisie, en passant le displayHallOfFame() comme fonction de rappel une fois le tableau 
		  � jour et persist�.
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
