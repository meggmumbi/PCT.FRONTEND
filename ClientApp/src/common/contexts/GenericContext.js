import { createContext, useReducer } from "react";
const initialState = {};

const GenericContextReducer = (state, action) => {
  let key = action.key;
  switch (action.type) {
      case 'SET':
          return {
              ...state,
             [key]: action.payload
          };

      case 'OVERRIDE':
          return {
              ...state,
             ...action.payload
          };
      case 'DEL':
          const { [key]: foo, ...rest } = state;
          state = rest;
          return state;
      default:
          return state;
    }
  };

  const GenericStore = ({children}) => {
    const [state, dispatch] = useReducer(GenericContextReducer, initialState);
   
    return (
        <Context.Provider value={[state, dispatch]}>
            {children}
        </Context.Provider>
    )
};

export const Context = createContext(initialState);
export default GenericStore;