import type { Component } from 'solid-js';

import { For, createSignal } from 'solid-js';

import tooltip from './tooltipdirective';
tooltip;

declare module "solid-js" {
  namespace JSX {
    interface Directives {
      tooltip: Element;
    }
  }
}

const TTBox: Component<{ id: number }> = (props) => {

  const style = {
    width: '230px',
    height: '100px',
    border: '1px solid black',
    'box-shadow': '0 0 5px black',
    background: '#efefef',
  };

  return (
    <div style={style}>
      <h4>Tooltip: {props.id}</h4>
    </div>
  );
};

const App: Component = () => {
  const d = [...Array(720)].map((_, i) => ({ id: i, background: `hsl(${i}, 100%, 50%)` }));
  const [testdata, setTestdata] = createSignal(d);

  const toggletestdata = () => {
    if (testdata().length === 0) {
      setTestdata(d);
    } else {
      setTestdata([]);
    }
  };

  return (
    <>
      <button onclick={toggletestdata}>Toggle</button>
      <div style="display: grid; grid-gap: 2px; grid-template-rows: repeat(auto-fill, minmax(70px, 1fr)); grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));">
        <For each={testdata()}>
          {d => <div
            style={{
              width: '68px',
              height: '68px',
              background: d.background,
              display: 'flex',
              'align-items': 'center',
              'justify-content': 'center'
            }}
            use:tooltip={<TTBox id={d.id} />}>{d.id}</div>}
        </For>
      </div>
    </>
  );
};

export default App;
