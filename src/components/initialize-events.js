import { createElement } from 'preact';
import { useCallback, useEffect } from 'preact/hooks';

import { zimletEventEmitter, callWith } from '@zimbra-client/util';
import { ZIMBRA_ZIMLET_EVENTS } from '@zimbra-client/constants';
import ConfirmModal from './confirm-modal';

const MODAL_ID = 'zimbra-zimlet-dlp-dialog';

export const InitializeEvents = ({ context }) => {
   const { dispatch } = context.store;
   const { addModal } = context.zimletRedux.actions.zimlets;
   const { removeModal } = context.zimletRedux.actions.zimlets;

   const onDialogClose = useCallback(
      reject => {
         reject();
         dispatch(removeModal({ id: MODAL_ID }));
      },
      [dispatch, removeModal]
   );

   const onDialogAction = useCallback(
      resolve => {
         resolve();
         dispatch(removeModal({ id: MODAL_ID }));
      },
      [dispatch, removeModal]
   );

   const onSendHandler = useCallback(
      ({ message }) =>
         new Promise((resolve, reject) => {
            let request = new XMLHttpRequest();
            let url = '/analyze/';
            request.open('POST', url);
            request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            request.onreadystatechange = function (e) {
               if (request.readyState == 4) {
                  if (request.status == 200) {
                     const result = JSON.parse(request.responseText);
                     let hit = false;
                     let reasons = "";
                     console.log(request.responseText);
                     Object.entries(result).forEach((entry) => {
                        const [key, value] = entry;
                        if ((value.score >= 1)
                           && !((value.entity_type == "EMAIL_ADDRESS") || (value.entity_type == "DOMAIN_NAME"))
                        ) {
                           hit = true;
                           if (reasons.indexOf(value.entity_type) < 0) {
                              reasons += value.entity_type;
                              reasons += ", ";
                           }
                        }
                     });
                     if (hit == true) {
                        reasons = reasons.replace(/_/g, ' ');
                        reasons = reasons.toLowerCase();
                        reasons = reasons.replace(/..$/, ".")
                        const modal = (
                           <ConfirmModal
                              onClose={callWith(onDialogClose, reject)}
                              onAction={callWith(onDialogAction, resolve)}
                              result={reasons}
                           />
                        );
                        dispatch(addModal({ id: MODAL_ID, modal }));
                     } else {
                        resolve();
                     }
                  }
                  else {
                     alert('Failed to do this request.');
                  }
               }
            }
            //to-do implement language
            //to-do add subject
            request.send(JSON.stringify({ "text": message.subject + message.text, "language": "en" }));
         }),
      [dispatch, addModal, onDialogAction, onDialogClose]
   );

   useEffect(() => {
      zimletEventEmitter.on(ZIMBRA_ZIMLET_EVENTS.ONSEND, onSendHandler, true);

      return () => {
         zimletEventEmitter.off(ZIMBRA_ZIMLET_EVENTS.ONSEND, onSendHandler);
      };
   }, [onSendHandler]);

   return null;
};
