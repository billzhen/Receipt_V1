import React from "react";
import "./App.css";
import config from "./config/config";

import Chatgpt from "./compoments/ChatGPT";
import { useState } from "react";
const pageRouter = {
  changeRoute: () => { },
};
// export const PageRouterContext = React.createContext(pageRouter);

function App() {
  const [target, setTaget] = useState({ id: "", data: {} });
  const changeRoute = (route) => {
    setTaget((target) => ({
      ...route,
    }));
  };

  const getParams = (url = window.location.href) => {
    const theRequest = {};
    if (url.indexOf('?') !== -1) {
      const str = url.split('?')[1];
      const strs = str.split('&');
      for (let i = 0; i < strs.length; i += 1) {
        theRequest[strs[i].split('=')[0]] = decodeURI(strs[i].split('=')[1]);
      }
    }
    return theRequest;
  }

  let Compoment = null;
  const setPage = () => {

    const params = getParams();
    if (params.qrCode) {
      Compoment = Chatgpt;
      return;
    }
    switch (target.id) {
      case config.pages.chatgpt:
        Compoment = Chatgpt;
        break;
      default:
        Compoment = Chatgpt;
        break;
    }
  };

  setPage();
  return (
    <div className="App">
      <div>
        {/*<PageRouterContext.Provider value={changeRoute}>*/}
          <Compoment></Compoment>
        {/*</PageRouterContext.Provider>*/}
      </div>
    </div>
  );
}

export default App;
