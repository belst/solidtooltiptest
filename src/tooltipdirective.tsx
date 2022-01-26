import { createSignal, JSXElement, onCleanup } from "solid-js";

const [values, setValues] = createSignal();

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