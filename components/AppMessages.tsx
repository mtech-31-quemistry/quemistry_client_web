import { Messages } from 'primereact/messages';
import { forwardRef, ReactNode, useImperativeHandle, useRef } from 'react';


//showInfomation(messageContent)
export type AppMessage = { 
    showInformation: (messageContent: string) => void, 
    showError: (messageContent: string) => void, 
    showWarning: (messageContent: string) => void,
    showCustomInformation: (messageContent: ReactNode) => void,
    showCustomWarning: (messageContent: ReactNode) => void  
}
type Props = {};
const AppMessages = forwardRef<AppMessage, Props>((props, ref) =>{
    const msgs = useRef<Messages>(null);

    useImperativeHandle(ref, () => ({ 
        showInformation(messageContent: string){
            msgs.current?.show([{ severity: 'info', summary: 'Info', icon: 'pi pi-send', detail: messageContent, closable: true, sticky: true }]);
        },
        showCustomInformation(messageContent: ReactNode){
            msgs.current?.show([{ severity: 'info', summary: 'Info', icon: 'pi pi-send', content: messageContent, closable: true, sticky: true }]);
        },

        showError(messageContent: string){
            msgs.current?.show([{ severity: 'error', summary: 'Error', icon: 'pi pi-error', detail: messageContent, closable: true, sticky: true }]);
        },
        showWarning(messageContent: string){
            msgs.current?.show([{ severity: 'warn', summary: 'Warn', icon: 'pi pi-warning', detail: messageContent, closable: true, sticky: true }]);
        },
        showCustomWarning(messageContent: ReactNode){
            msgs.current?.show([{ severity: 'warn', summary: 'Warn', icon: 'pi pi-warning', content: messageContent, closable: true, sticky: true }]);
        },
    }));
    return (
        <div className='col-12'>
            <Messages ref={msgs} />
        </div>
    )
});
AppMessages.displayName = 'AppMessages';

export default AppMessages;