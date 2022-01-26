import { createSignal, JSXElement, onCleanup } from "solid-js";

const [values, setValues] = createSignal();

let tooltipcontainer: HTMLDivElement = (
    <div style={{
        position: 'absolute',
        'pointer-events': 'none',
        transition: 'opacity 0.1s ease-in'
    }}>{values() as JSXElement}</div> as HTMLDivElement
);

const calculatePosition = (x: number, y: number, target: HTMLElement) => {
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

    if (x + width > bwidth) {
        position.left = `${x - width}px`;
    } else {
        position.left = `${x}px`;
    }
    if (y + height > bheight) {
        position.top = `${y - height}px`;
    } else {
        position.top = `${y}px`;
    }

    return position;
}

const l = (e: MouseEvent) => {
    const pos = calculatePosition(e.pageX, e.pageY, tooltipcontainer);
    tooltipcontainer.style.top = pos.top as string;
    tooltipcontainer.style.left = pos.left as string;
}

let counter = 0;

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
}

const tooltip = (el: HTMLElement, values: any) => {

    const myenter = enter(values);
    el.addEventListener('mouseenter', myenter);
    el.addEventListener('mouseleave', leave);
    counter++;

    if (counter === 1) {
        document.body.appendChild(tooltipcontainer as Node);
    }

    onCleanup(() => {
        el.removeEventListener('mouseenter', myenter);
        el.removeEventListener('mouseleave', leave);
        counter--;
        if (counter <= 0) {
            document.body.removeChild(tooltipcontainer);
            counter = 0;
        }
    });
};

export default tooltip;