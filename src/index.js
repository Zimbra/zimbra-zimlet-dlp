import { createElement } from 'preact';

import { InitializeEvents } from './components/initialize-events';

export default function Zimlet(context) {
	const { plugins } = context;
	const exports = {};

	exports.init = function init() {
		plugins.register('slot::mail-composer-toolbar-send', () => (
			<InitializeEvents context={context} />
		));
	};

	return exports;
}
