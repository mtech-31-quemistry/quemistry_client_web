import { Messages } from 'primereact/messages';
import { forwardRef, ReactNode, useImperativeHandle, useRef } from 'react';


//showInfomation(messageContent)
export type AppMessage = {
    showSuccess: (messageContent: string, isAutoDismiss?: boolean, dismissTimerInSeconds?: number) => void,
    showInformation: (messageContent: string, isAutoDismiss?: boolean, dismissTimerInSeconds?: number) => void,
    showError: (messageContent: string, isAutoDismiss?: boolean, dismissTimerInSeconds?: number) => void,
    showWarning: (messageContent: string, isAutoDismiss?: boolean, dismissTimerInSeconds?: number) => void,

    showCustomSuccess: (messageContent: ReactNode, isAutoDismiss?: boolean, dismissTimerInSeconds?: number) => void,
    showCustomInformation: (messageContent: ReactNode, isAutoDismiss?: boolean, dismissTimerInSeconds?: number) => void,
    showCustomWarning: (messageContent: ReactNode, isAutoDismiss?: boolean, dismissTimerInSeconds?: number) => void
}

type Props = {
    isAutoDismiss?: boolean | undefined;
    dismissTimerInSeconds?: number | undefined;
};

const AppMessages = forwardRef<AppMessage, Props>((props, ref) =>{
    const msgs = useRef<Messages>(null);

    useImperativeHandle(ref, () => ({
        showSuccess(messageContent: string, isAutoDismiss?: boolean, dismissTimerInSeconds?: number){
            msgs.current?.show([{ severity: 'success', summary: '',  detail: messageContent, closable: true, sticky: true }]);
            this.clearMessagesIfAutoDismiss(isAutoDismiss, dismissTimerInSeconds);
        },
        showCustomSuccess(messageContent: ReactNode, isAutoDismiss?: boolean, dismissTimerInSeconds?: number){
            msgs.current?.show([{ severity: 'success', summary: '', content: messageContent, closable: true, sticky: true }]);
            this.clearMessagesIfAutoDismiss(isAutoDismiss, dismissTimerInSeconds);
        },
       showInformation(messageContent: string, isAutoDismiss?: boolean, dismissTimerInSeconds?: number){
            msgs.current?.show([{ severity: 'info', summary: '', icon: 'pi pi-send', detail: messageContent, closable: true, sticky: true }]);
           this.clearMessagesIfAutoDismiss(isAutoDismiss, dismissTimerInSeconds);
        },
        showCustomInformation(messageContent: ReactNode, isAutoDismiss?: boolean, dismissTimerInSeconds?: number){
            msgs.current?.show([{ severity: 'info', summary: '', icon: 'pi pi-send', content: messageContent, closable: true, sticky: true }]);
            this.clearMessagesIfAutoDismiss(isAutoDismiss, dismissTimerInSeconds);
        },

        showError(messageContent: string, isAutoDismiss?: boolean, dismissTimerInSeconds?: number){
            msgs.current?.show([{ severity: 'error', summary: '', icon: 'pi pi-error', detail: messageContent, closable: true, sticky: true }]);
            this.clearMessagesIfAutoDismiss(isAutoDismiss, dismissTimerInSeconds);
        },
        showWarning(messageContent: string, isAutoDismiss?: boolean, dismissTimerInSeconds?: number){
            msgs.current?.show([{ severity: 'warn', summary: '', icon: 'pi pi-warning', detail: messageContent, closable: true, sticky: true }]);
            this.clearMessagesIfAutoDismiss(isAutoDismiss, dismissTimerInSeconds);
        },
        showCustomWarning(messageContent: ReactNode, isAutoDismiss?: boolean, dismissTimerInSeconds?: number){
            msgs.current?.show([{ severity: 'warn', summary: '', icon: 'pi pi-warning', content: messageContent, closable: true, sticky: true }]);
            this.clearMessagesIfAutoDismiss(isAutoDismiss, dismissTimerInSeconds);
        },
        getDismissTimer(isAutoDismiss?: boolean | undefined, dismissTimerInSeconds?: number | undefined) {
            let displayTimer = undefined;

            // default dismiss timer is 3 sec
            if (isAutoDismiss) {
                if (dismissTimerInSeconds && dismissTimerInSeconds > 0) {
                    displayTimer = dismissTimerInSeconds * 1000;
                } else {
                    displayTimer = 3000;
                }
            }

            return displayTimer;
        },
        clearMessagesIfAutoDismiss(isAutoDismiss?: boolean, dismissTimerInSeconds?: number) {
            const displayTimer = this.getDismissTimer(isAutoDismiss, dismissTimerInSeconds);
            displayTimer && setTimeout(() => msgs.current?.clear(), displayTimer);
        }
    }));
    return (
        <div className='col-12'>
            <Messages ref={msgs} />
        </div>
    )
});
AppMessages.displayName = 'AppMessages';

export default AppMessages;
