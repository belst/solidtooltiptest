import { Component, createSignal, JSX, Show, splitProps } from 'solid-js';
import { Portal } from 'solid-js/web';

const Tooltip: Component<{ content: any } & JSX.HTMLAttributes<HTMLDivElement>> = (props) => {

    const [show, setShow] = createSignal(false);

    const [local, divprops] = splitProps(props, ['children', 'content'])

    let portal!: HTMLDivElement;
    const l = (e: MouseEvent) => {
        portal.style.position = 'absolute';
        portal.style.top = `${e.clientY}px`;
        portal.style.left = `${e.clientX}px`;
        console.log(portal);
    };

    const mouseenter = (e: MouseEvent) => {
        console.log('mouseenter', e);
        setShow(true);
        document.body.addEventListener('mousemove', l);
        setTimeout(() => portal.style.pointerEvents = 'none', 0);
    }

    const mouseleave = (e: MouseEvent) => {
        console.log('mouseleave', e.currentTarget)
        setShow(false);
        document.body.removeEventListener('mousemove', l);
    }

    return (
        <>
            <Show when={show()}>
                <Portal mount={document.getElementById('overlay') as Node} ref={portal}>{local.content}</Portal>
            </Show>
            <div {...divprops} onmouseover={mouseenter} onmouseleave={mouseleave}>{local.children}</div>
        </>);
};

export default Tooltip;
