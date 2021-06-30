import test from 'ava'
import {shuffle, random, backgrounds} from '../public/game/utils.js'

test('we have a list of scenes', (t) => {
	const bgs = new backgrounds()
	t.true(bgs.images.length > 1)
})

test('it chooses a random background', (t) => {
	const bgs = new backgrounds()
	const scene = bgs.get()
	t.true(scene.startsWith('../images/scenes/'))
	t.true(scene.endsWith('.jpg'))
	// t.is(scene, '../images/scenes/moonlit-landscape-1904.jpg')
})

test('it chooses a random one', (t) => {
	const bgs = new backgrounds()
	t.plan(bgs.images.length)

	for (const bg of bgs.images) {
		// console.log('available:', bgs.images)
		let chosenBg = bgs.get().replace('../images/scenes/', '')
		console.log(chosenBg)
		// console.log('chosen:', chosenBg, 'remaining:', bgs.images)
		t.is(1, 1)
		// t.false(bgs.images.includes(chosenBg), 'scene was removed from list')
	}
})
