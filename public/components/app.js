import {html, Component} from '../web_modules/htm/preact/standalone.module.js'
import ActionManager from '../game/action-manager.js'
import actions from './../game/actions.js'
import {isCurrentRoomCompleted} from '../game/utils.js'
import {createSimpleDungeon} from '../game/dungeon-encounters.js'
import {createCard} from './../game/cards.js'
import {Player, Monster} from './player.js'
import Cards from './cards.js'
import History from './history.js'

export default class App extends Component {
	constructor() {
		super()
		// Set up our action manager.
		this.am = ActionManager()

		// Prepare the game.
		let state = actions.createNewGame()
		state = actions.setDungeon(state, createSimpleDungeon())
		state = actions.drawStarterDeck(state)
		state = actions.drawCards(state)
		// state.dungeon.index = 1 // use this to change room
		this.state = state

		// Enable debugging in the browser.
		window.slaytheweb = {
			component: this,
			actions,
			createCard
		}
	}

	componentDidMount() {
		this.enableDrop()
	}

	enqueue(action) {
		this.am.enqueue(action)
	}
	dequeue(callback) {
		const nextState = this.am.dequeue(this.state)
		this.setState(nextState, callback)
	}
	undo() {
		const prev = this.am.past.takeFromTop()
		if (!prev) return
		console.log('Undoing', prev.action.type)
		this.setState(prev.state)
	}

	endTurn() {
		this.enqueue({type: 'endTurn'})
		this.dequeue()
	}

	enableDrop() {
		// Enable drag and drop.
		const dropzones = this.base.querySelectorAll('.dropzone')
		const drop = new window.Sortable.default(dropzones, {
			draggable: '.Card',
			mirror: {constrainDimensions: true}
		})

		drop.on('sortable:start', event => {
			// Find the card object behind the DOM card we are dragging.
			const card = this.state.hand.find(c => c.id === event.data.dragEvent.data.source.dataset.id)
			if (card.energy > this.state.player.currentEnergy) {
				event.cancel()
				alert('Not enough energy to play this card.')
			}
		})

		drop.on('sortable:sort', event => {
			// Only allow dropping on elements with this class.
			const el = event.dragEvent.data.overContainer
			if (!el.classList.contains('is-cardTarget')) event.cancel()
		})

		drop.on('sortable:stop', event => {
			const {newContainer, oldContainer, dragEvent} = event.data

			// Should it be allowed to drop the card here?
			const allowCardPlay =
				newContainer.classList.contains('is-cardTarget') && newContainer !== oldContainer
			if (!allowCardPlay) return

			// If yes, use the DOM to find the played card.
			const card = this.state.hand.find(c => c.id === dragEvent.originalSource.dataset.id)

			// Also use the DOM to find who we dropped it on.
			let target
			if (newContainer.classList.contains('Player')) {
				target = 'player'
			} else {
				const index = Array.from(newContainer.parentNode.children).indexOf(newContainer)
				target = `enemy${index}`
			}
			// Play the card immediately
			this.enqueue({type: 'playCard', target, card})
			this.dequeue()
		})
	}

	render(props, state) {
		const room = state.dungeon.rooms[state.dungeon.index]
		const didWin = isCurrentRoomCompleted(state)
		return html`
			<div class="App">
				<div class="Split">
					<${Player} model=${state.player} name="You" />
					<div class="Monsters">
						${room.monsters.map(
							(monster, index) =>
								html`
									<${Monster} model=${monster} name=${`Monster ${index}`} />
								`
						)}
					</div>
				</div>

				<p class="Actions">
					${didWin
						? html`
								<button onClick=${props.onWin}>YOU WON! Try again?</button>
						  `
						: html`
								<button onclick=${() => this.endTurn()}>End turn</button>
						  `}
				</p>

				<div class="Hand">
					<div class="EnergyBadge">${state.player.currentEnergy}/${state.player.maxEnergy}</div>
					<${Cards} cards=${state.hand} isHand=${true} canDrag=${true} />
				</div>

				<div class="Split">
					<details>
						<summary>Draw pile ${state.drawPile.length}</summary>
						<${Cards} cards=${state.drawPile} />
					</details>
					<details>
						<summary align-right>Discard pile ${state.discardPile.length}</summary>
						<${Cards} cards=${state.discardPile} isDiscardPile=${true} />
					</details>
				</div>

				<div class="Split">
					<${History} future=${this.am.future.list} past=${this.am.past.list} />
					<p><button onclick=${() => this.undo()}>Undo</button></p>
				</div>
			</div>
		`
	}
}
