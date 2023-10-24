import { createElement } from 'preact';
import { Text } from 'preact-i18n';

import { withIntl } from '../enhancers';
import { ModalDialog } from '@zimbra-client/components';

const ConfirmModal = ({ onClose, onAction, result }) => {
	return (
		<ModalDialog
			title="DLPZimlet.title"
			onAction={onAction}
			onClose={onClose}
			actionLabel="DLPZimlet.sendAnyway"
			result={result}
		>
			<p>
				<Text id="DLPZimlet.description" />
			</p>
			<Text id="DLPZimlet.reasons" />: {result}
		</ModalDialog>
	);
};

export default withIntl()(ConfirmModal);
