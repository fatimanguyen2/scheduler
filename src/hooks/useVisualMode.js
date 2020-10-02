import {useState} from 'react';

function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  const transition = (newMode, replace = false) => {
    setMode(newMode);
    setHistory(prev => {
      let newHistory = [...prev];
      if (replace) {
        newHistory = newHistory.slice(0, -1);
      }
      return newHistory = [...newHistory, newMode];
    });
  };

  const back = () => {
    // Using methods that mutate arrays
    // const pureArray = [...history];
    // if (pureArray.length > 1) {
    //   pureArray.pop();
    // }
    // setHistory(pureArray);
    // setMode(pureArray[pureArray.length - 1]);

    setHistory(prev => {
      let newHistory = [...prev];
      if (newHistory.length > 1 ) {
        newHistory = newHistory.slice(0, -1);
      }
      setMode(newHistory[newHistory.length - 1]);
      return newHistory;
    })
  };

  return {mode, transition, back};
}

export default useVisualMode;
