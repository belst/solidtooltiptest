import { render } from 'solid-js/web';
import { TooltipProvider } from './tooltipdirective';

import App from './App';

render(
    () => (
        <TooltipProvider>
            <App />
        </TooltipProvider>
    ),
    document.getElementById('root') as HTMLElement
);
