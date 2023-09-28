import React, { createContext, useState } from 'react';
import Views from './components/views';
import Mode from './components/mode';
import Header from './components/header';
import Login from './components/login';
import Split from 'react-split';

export const infoContext = createContext();
export const authContext = createContext();

function App() {

  //詳細書誌情報はグローバルで管理する（型はオブジェクトだがメンバはまちまち）
  const [info, setInfo] = useState({});
  const [auth, setAuth] = useState(null);

  return (
    <div className="App">
      <authContext.Provider value={{ auth, setAuth }}>
      {
        auth ? (
          <infoContext.Provider value={{ info, setInfo }}>
          <Header />
          <Split
            class="flex"
            sizes={[50, 50]}
            minSize={100}
            expandToMin={false}
            gutterSize={10}
            gutterAlign="center"
            snapOffset={30}
            dragInterval={1}
            direction="horizontal"
            cursor="col-resize"
          >
            <Views />
            <Mode />
          </Split>
          </infoContext.Provider>
        ) : (
          <Login />
        )
      }
      </authContext.Provider>
    </div>
  );
}

export default App;