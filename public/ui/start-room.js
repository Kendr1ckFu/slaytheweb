import {html, Component} from '../web_modules/htm/preact/standalone.module.js'

export default class StartRoom extends Component {
	render() {
		return html`
			<h1 center medium>It begins…</h1>
			<ul class="Options">
				<li><button onclick=${() => this.props.onContinue()}>Choose a path</button></li>
			</ul>
			<p center>
				<button onclick=${() => (window.location = window.location.origin)}>Leave</button>
			</p>
		`
	}
}
