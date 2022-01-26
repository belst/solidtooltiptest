import { Component, For } from 'solid-js';
import Tooltip from './Tooltip';

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
}

const App: Component = () => {
  const testdata = [...Array(720)].map((_, i) => ({ id: i, background: `hsl(${i}, 100%, 50%)` }));

  return (
    <div style="display: grid; grid-gap: 2px; grid-template-rows: repeat(auto-fill, minmax(70px, 1fr)); grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));">
      <For each={testdata}>
        {d => <Tooltip style={{ width: '68px', height: '68px', background: d.background }} content={<TTBox id={d.id} />}>{d.id}</Tooltip>}
      </For>
    </div>
  );
};

export default App;
