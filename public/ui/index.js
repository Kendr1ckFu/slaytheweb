import {html, render, Component} from '../web_modules/htm/preact/standalone.module.js'
import gsap from '../web_modules/gsap.js'
import App from './app.js'

// This component decides what to render:
// A splash screen, a "win" screen or the game/app itself.
// It also detects if there's a saved game in the URL and allows the player to continue.

class Main extends Component {
	constructor() {
		super()
		this.state = {
			isPlaying: false,
		}
		this.handleWin = this.handleWin.bind(this)
		this.handleNewGame = this.handleNewGame.bind(this)
		this.handleLoose = this.handleLoose.bind(this)
		this.handleLoadGame = this.handleLoadGame.bind(this)
	}
	handleNewGame() {
		// Clear any previous saved game.
		window.history.pushState('', document.title, window.location.pathname)
		this.setState({isPlaying: true, didWin: false})
	}
	handleWin() {
		this.setState({isPlaying: false, didWin: true})
	}
	handleLoose() {
		this.setState({isPlaying: false, didWin: false})
	}
	handleLoadGame() {
		this.setState({isPlaying: true, didWin: false})
	}
	render(props, {didWin, isPlaying}) {
		// Game play UI
		if (isPlaying) return html` <${App} onWin=${this.handleWin} onLoose=${this.handleLoose} /> `
		// Win screen
		if (didWin) return html` <${WinScreen} onNewGame=${this.handleNewGame} /> `
		// Splash screen
		return html`
			<${SplashScreen} onNewGame=${this.handleNewGame} onContinue=${this.handleLoadGame} />
		`
	}
}

class SplashScreen extends Component {
	componentDidMount() {
		gsap.from('.Splash--fadein', {duration: 0.5, autoAlpha: 0, scale: 0.95})
		gsap.from('.Splash--fadein .Options', {
			delay: 0.2,
			duration: 1,
			y: -20,
			scale: 0.1,
			ease: 'bounce',
		})
		gsap.to('.Splash-spoder', {delay: 5, x: 420, y: 60, duration: 3})
	}
	render(props, state) {
		return html`
			<article class="Splash Splash--fadein">
				<h1 style="margin-top:20vh">Slay the Web</h1>
				<h2>A card crawl adventure for you and your browser</h2>
				<img class="Splash-spoder" src="ui/images/spoder.png" />
				<ul class="Options">
					${location.hash
						? html`
							<li><button autofocus onClick=${props.onContinue}>Continue Game</button></li>
							<li><button autofocus onClick=${props.onNewGame}>New Game</a></li>
				`
						: html`<li><button autofocus onClick=${props.onNewGame}>Play</a></li>`}
				</ul>
				${!state.hideTutorial &&
				html`
					<div class="Splash-details Article">
						<p><strong>What's going on?</strong></p>
						<p>
							Slay the Web is a single player card game where you fight monsters to reach the end of
							the web. It's a game of planning and knowing when to play which card.
						</p>
						<p>
							Every turn you draw 5 cards from your draw pile. Cards cost energy to play, and you
							get 3 energy every turn.
						</p>
						<p>
							Cards can deal damage to monsters, block enemy attacks or make them weak or vulnerable.
							They can heal you and other things. You'll figure it out.
						</p>
						<p>Beware, whenever you end your turn, the monsters take turn.</p>
						<p>
							Should you manage to kill the monsters in a room before they end you, you'll proceed
							to the next room. Maybe there will be rewards. Can you reach the end?
						</p>
						<p>The game is <a href="https://github.com/oskarrough/slaytheweb" rel="noreferrer" target="_blank">open source</a>.</p>
					</div>
				`}
			</article>
		`
	}
}

const WinScreen = (props) => html`
	<article class="Splash">
		<h1>Well done. You won.</h1>
		<p><button autofocus onClick=${props.onNewGame}>Play again</a></p>
	</article>
`

render(html` <${Main} /> `, document.querySelector('#SlayTheWeb'))

// enum GameMode {
//  	CHAR_SELECT, GAMEPLAY, DUNGEON_TRANSITION, SPLASH;
// }
