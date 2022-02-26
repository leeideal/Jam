import React, { useEffect } from 'react';
import RouteView from './Routes';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRecoilState } from "recoil";
import { isLogin } from "../atom";

function App() {
  const auth = getAuth();
  const [checkLog, setCheckLog]= useRecoilState(isLogin);


  useEffect(()=>{
    onAuthStateChanged(auth, (user) => {
        if (user) {
            setCheckLog(true);
          }else {
            setCheckLog(false);
          }
        })
  },[]) 

  return (
    <>
      <RouteView/>
    </>
  );
}

export default App;
