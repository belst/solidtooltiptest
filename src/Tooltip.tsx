import { Component, createSignal, JSX, Show, splitProps } from 'solid-js';
import { Portal } from 'solid-js/web';

const Tooltip: Component<{ content: any } & JSX.HTMLAttributes<HTMLDivElement>> = (props) => {

    const [show, setShow] = createSignal(false);
    const [x, setX] = createSignal(0);
    const [y, setY] = createSignal(0);


    const [local, divprops] = splitProps(props, ['children', 'content'])


    const calculatePosition = (target: HTMLElement) => {
        const { width, height } = target.getBoundingClientRect();
        const { width: bwidth } = document.body.getBoundingClientRect();

        const bheight = Math.max(
            document.body.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.clientHeight,
            document.documentElement.scrollHeight,
            document.documentElement.offsetHeight
        );

        const position: { [key: string]: null | string } = {
            left: null,
            right: null,
            top: null
        };

        if (x() + width > bwidth) {
            position.right = `${bwidth - x()}px`;
        } else {
            position.left = `${x()}px`;
        }
        if (y() + height > bheight) {
            position.top = `${y() - height}px`;
        } else {
            position.top = `${y()}px`;
        }

        return position;
    }

    let foo!: HTMLDivElement;


    const l = (e: MouseEvent) => {
        setX(e.pageX);
        setY(e.pageY);
    };

    const mouseenter = (e: MouseEvent) => {
        setX(e.pageX);
        setY(e.pageY);
        setShow(true);
        document.body.addEventListener('mousemove', l);
    }

    const mouseleave = (e: MouseEvent) => {
        setShow(false);
        document.body.removeEventListener('mousemove', l);
    }
    return (
        <>
            <Show when={show()}>
                <Portal>
                    <div ref={foo} style={{
                        position: 'absolute',
                        'pointer-events': 'none',
                        ...calculatePosition(foo)
                    }}>{local.content}</div>
                </Portal>
            </Show>
            <div {...divprops} onmouseenter={mouseenter} onmouseleave={mouseleave}>{local.children}</div>
        </>
    );
};

export default Tooltip;
