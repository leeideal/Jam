import React, { useEffect } from 'react';
import RouteView from './Routes';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRecoilState } from "recoil";
import { firstProfile, isLogin, IUser, profilecheck, user } from "../atom";
import { doc, getDoc, getFirestore  } from "firebase/firestore";

function App() {
  const auth = getAuth();
  const dbService = getFirestore();
  const [checkLog, setCheckLog]= useRecoilState(isLogin);
  const [userObj, setUserObj] = useRecoilState<IUser>(user);
  const [isProfile, setisProfile] = useRecoilState(profilecheck);
  const [isFirstProfile, setIsFirstProfile] = useRecoilState(firstProfile);

  const checkProfile = async(user:any) => {
    const docRef = doc(dbService, "profiles", `${user}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        setisProfile(true);
      } else {
        setisProfile(false);
        setIsFirstProfile(true);
      }
}


  useEffect(()=>{
    onAuthStateChanged(auth, (user) => {
        if (user) {
            setCheckLog(true);
            setUserObj({uid:user.uid});
            checkProfile(user.uid);
          }else {
            setCheckLog(false);
            setUserObj({uid : null});
          }
        })
  },[isProfile]) 

  return (
    <>
      <RouteView/>
    </>
  );
}

export default App;
