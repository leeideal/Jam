import React, { useEffect } from 'react';
import RouteView from './Routes';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRecoilState } from "recoil";
import { isLogin, IUser, user } from "../atom";
import { doc, getDoc, getFirestore  } from "firebase/firestore";

function App() {
  const auth = getAuth();
  const dbService = getFirestore();
  const [checkLog, setCheckLog]= useRecoilState(isLogin);
  const [userObj, setUserObj] = useRecoilState<IUser>(user);

  const checkProfile = async(user:any) => {
    const docRef = doc(dbService, "profiles", `${user}`);
    const docSnap = await getDoc(docRef);
}


  useEffect(()=>{
    onAuthStateChanged(auth, (user) => {
        if (user) {
            setCheckLog(true);
            setUserObj({uid:user.uid});
            checkProfile(user.uid);
            if (localStorage.getItem("uid") === null){
              localStorage.setItem("uid", user.uid);
            }
          }else {
            setCheckLog(false);
            setUserObj({uid : null});
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
