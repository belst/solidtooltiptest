import { createSignal, JSXElement, onCleanup, createContext, useContext } from "solid-js";

interface TooltipContextValue {
    enter: any,
    leave: any,
    counter: any,
    setCounter: any,
    cleanup: any,
    init: any
};

export const TooltipContext = createContext<TooltipContextValue>({
    enter: () => { },
    leave: () => { },
    counter: () => { },
    setCounter: () => { },
    cleanup: () => { },
    init: () => { },
});

export const TooltipProvider = (props: { children: any }) => {
    const [values, setValues] = createSignal();
    const [counter, setCounter] = createSignal(0);

    let tooltipcontainer: HTMLDivElement = (
        <div style={{
            position: 'absolute',
            'pointer-events': 'none',
            transition: 'opacity 0.1s ease-in'
        }}>{values() as JSXElement}</div> as HTMLDivElement
    );

    const calculatePosition = (e: MouseEvent, target: HTMLElement) => {
        const { width, height } = target.getBoundingClientRect();

        const position: { [key: string]: null | string } = {
            left: null,
            top: null
        };

        const offset = 20;

        if (e.clientX + width > window.innerWidth) {
            position.left = `${e.pageX - width}px`;
        } else {
            position.left = `${e.pageX}px`;
        }
        if (e.clientY + height + offset > window.innerHeight) {
            position.top = `${e.pageY - height - offset}px`;
        } else {
            position.top = `${e.pageY + offset}px`;
        }

        return position;
    }

    const l = (e: MouseEvent) => {
        const pos = calculatePosition(e, tooltipcontainer);
        tooltipcontainer.style.top = pos.top as string;
        tooltipcontainer.style.left = pos.left as string;
    }

    const enter = (values: any) => {
        return () => {
            setValues(values);
            // el.style.display = 'block';
            tooltipcontainer.style.opacity = '1';
            document.body.addEventListener('mousemove', l);
        }
    };

    const leave = () => {
        // el.style.display = 'none';
        tooltipcontainer.style.opacity = '0';
        document.body.removeEventListener('mousemove', l)
    };

    const cleanup = () => {
        console.log(tooltipcontainer);
        setCounter(c => --c);
        if (counter() <= 0) {
            document.body.removeChild(tooltipcontainer);
            setCounter(0);
        }
    };

    const init = () => {
        document.body.appendChild(tooltipcontainer);
    };


    const store = {
        enter,
        leave,
        counter,
        setCounter,
        cleanup,
        init
    };
    return (
        <TooltipContext.Provider value={store}>
            {props.children}
        </TooltipContext.Provider>
    );
}


const tooltip = (el: HTMLElement, values: any) => {

    const ctx = useContext<TooltipContextValue>(TooltipContext);

    const myenter = ctx.enter(values);
    el.addEventListener('mouseenter', myenter);
    el.addEventListener('mouseleave', ctx.leave);
    ctx.setCounter((c: number) => ++c);

    if (ctx.counter() === 1) {
        ctx.init();
    }

    onCleanup(() => {
        el.removeEventListener('mouseenter', myenter);
        el.removeEventListener('mouseleave', ctx.leave);
        ctx.cleanup();
    });
};

export default tooltip;