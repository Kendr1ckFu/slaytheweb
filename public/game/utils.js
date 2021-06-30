// A collection of utility functions.
// None are allowed to modify the game state!

// Returns a random-looking string for ids.
export function uuid(a) {
	return a
		? (a ^ ((Math.random() * 16) >> (a / 4))).toString(16)
		: ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, uuid)
}

// Get a random number within a range
export function random(from, to) {
	const r = range(1 + to - from, from) // random(2,4) = range(3,2)
	if (from === to) return from // e.g. 5-5 returns 5 instead of 0
	return shuffle(r)[0]
}

// Returns a new, shuffled version of an array.
// See https://bost.ocks.org/mike/shuffle/
export function shuffle(array) {
	// Make a copy
	array = array.slice()
	var m = array.length
	var t
	var i

	// While there remain elements to shuffle…
	while (m) {
		// Pick a remaining element…
		i = Math.floor(Math.random() * m--)

		// And swap it with the current element.
		t = array[m]
		array[m] = array[i]
		array[i] = t
	}

	return array
}

// Returns a range of numbers. Example: range(3) === [1,2,3] or range(3, 6) === [6,7,8]
// range(3, 2) = [2,3,4]
export function range(size, startAt = 0) {
	return [...Array(size).keys()].map((i) => i + startAt)
}

// Returns the current map node
export function getCurrMapNode(state) {
	return state.dungeon.graph[state.dungeon.y][state.dungeon.x]
}

// Returns the current room in a dungeon.
export function getCurrRoom(state) {
	const node = getCurrMapNode(state)
	if (!node.room) throw new Error('This node has no room')
	return node.room
}

// Returns an array of targets (player or monsters) in the current room.
// The "target" argument must be either "player", "enemyx" (where x is the index) or "all enemies"
export function getTargets(state, targetString) {
	if (targetString.startsWith('player')) {
		return [state.player]
	}
	const room = getCurrRoom(state)
	if (targetString.startsWith('enemy')) {
		const index = targetString.split('enemy')[1]
		const monster = room.monsters[index]
		if (!monster) {
			throw new Error(
				`Could not find "${targetString}" on floor ${state.dungeon.y}, room ${state.dungeon.y}`
			)
		}
		return [monster]
	}
	if (targetString === 'all enemies') {
		return room.monsters
	}
	throw new Error(`Can not find monster with target: "${targetString}"`)
}

export function cardHasValidTarget(cardTarget, targetString) {
	return (
		(cardTarget === 'player' && targetString.includes('player')) ||
		(cardTarget === 'enemy' && targetString.includes('enemy')) ||
		(cardTarget === 'all enemies' && targetString.includes('enemy'))
	)
}

export function isRoomCompleted(room) {
	if (room.type === 'monster') {
		const deadMonsters = room.monsters.filter((m) => m.currentHealth < 1)
		return deadMonsters.length === room.monsters.length
	} else if (room.type === 'campfire') {
		return room.choice === 'rest' || Boolean(room.reward)
	} else if (room.type === 'start') {
		return true
	}
	throw new Error(`could not check if room has been completed: "${room.type}"`)
}

// Check if the current room in a game has been cleared.
export function isCurrentRoomCompleted(state) {
	const room = getCurrRoom(state)
	return isRoomCompleted(room)
}

// Checks if the whole dungeon (all rooms) has been cleared.
// As long as there is one cleared node per floor.
export function isDungeonCompleted(state) {
	const clearedRooms = state.dungeon.graph
		.map((floor) => {
			return floor.some((node) => {
				return node.room && isRoomCompleted(node.room)
			})
		})
		.filter(Boolean)
	return clearedRooms.length === state.dungeon.graph.length
}

export function clamp(x, lower, upper) {
	return Math.max(lower, Math.min(x, upper))
}

export function assert(condition, message) {
	if (!condition) throw new Error(message)
}

export class backgrounds {
	constructor() {
		this.folder = '../images/scenes/'
		this.images = [
			// '1.jpg',
			// 'arietty.jpg',
			// 'bauhaus.jpg',
			// 'chihiro.jpg',
			// 'flying-duo.jpg',
			'howl.jpg',
			// 'landscape.jpg',
			'laputa.jpg',
			// 'mononoke.jpg',
			// 'moonlit-landscape-1904.jpg',
			// 'nausicaa.jpg',
			'ponyo.jpg',
		]
		this.backupImages = [...this.images]
		this.used = []
	}
	get() {
		let index = random(0, 3)
		// if (this.images.length === 1) index = 0
		const image = this.images[index]
		console.log(image)
		// console.log('get', this.images, index, image)
		// this.used.push(image)
		// this.images.splice(index, 1)
		// console.log(this.images)
		return this.folder + image
	}
}

// export function getBackground(state) {
// 	const folder = '../images/scenes/'
// 	const scenes = backgrounds.map((filename) => folder + filename)
// 	const randomIndex = random(0, scenes.length - 1)
// 	const scene = scenes[randomIndex]
// 	// console.log(scene)
// 	// console.log(backgrounds.length)
// 	// backgrounds.splice(randomIndex, 1)
// 	// console.log(backgrounds.length)
// 	return scene
// }
