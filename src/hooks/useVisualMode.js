import {useState} from 'react';

function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  const transition = (newMode, replace = false) => {
    setMode(newMode);
    if (replace) {
      let newHistory = [...history];
      // newHistory.pop().push(newMode); WHY WHY WHY WHY
      newHistory.splice(-1, 1, newMode)
      setHistory(newHistory);  
    } else {
      setHistory([...history, newMode])
    }
  };

  const back = () => {
    const pureArray = [...history];
    if (pureArray.length > 1) {
      pureArray.pop();
    }
    setHistory(pureArray);
    setMode(pureArray[pureArray.length - 1]);
  };

  return {mode, transition, back};
}

export default useVisualMode;
