import { batch, Component, createEffect, createSignal, JSX, on, Show, splitProps } from 'solid-js';
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
            top: null
        };

        if (x() + width > bwidth) {
            position.left = `${x() - width}px`;
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

    const l = (e: MouseEvent) => {
        batch(() => {
            setX(e.pageX);
            setY(e.pageY);
        });
    };

    const mouseenter = (e: MouseEvent) => {
        batch(() => {
            setX(e.pageX);
            setY(e.pageY);
            setShow(true);
            document.body.addEventListener('mousemove', l);
        });
    }

    const mouseleave = (e: MouseEvent) => {
        setShow(false);
        document.body.removeEventListener('mousemove', l);
    }

    let ref: HTMLDivElement | undefined;

    createEffect(on([show, x, y], () => {
        if (show() && ref) {
            ref.style.position = 'absolute';
            ref.style.pointerEvents = 'none';
            const pos = calculatePosition(ref);
            ref.style.top = pos.top as string;
            ref.style.left = pos.left as string;
        }
    }));

    return (
        <>
            <Show when={show()}>
                <Portal ref={ref}>
                    {local.content}
                </Portal>
            </Show>
            <div {...divprops} onmouseenter={mouseenter} onmouseleave={mouseleave}>{local.children}</div>
        </>
    );
};

export default Tooltip;
