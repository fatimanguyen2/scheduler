import {useState} from 'react';

function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  const transition = (newMode, replace = false) => {
    setMode(newMode);
    if (replace) {
      let newHistory = [...history];
      // newHistory.splice(-1, 1, newMode)
      newHistory = newHistory.slice(0, -1);
      newHistory = [...newHistory, newMode];
      setHistory(newHistory);  
    } else {
      setHistory([...history, newMode])
    }
  };

  const back = () => {

    // Using methods that mutate arrays
    // const pureArray = [...history];
    // if (pureArray.length > 1) {
    //   pureArray.pop();
    // }
    // setHistory(pureArray);
    // setMode(pureArray[pureArray.length - 1]);

    let newHistory = [...history];
    if (newHistory.length > 1 ) {
      newHistory = newHistory.slice(0, -1);
    }
    setHistory(newHistory);
    setMode(newHistory[newHistory.length - 1]);
  };

  return {mode, transition, back};
}

export default useVisualMode;
