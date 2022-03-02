import styled from "styled-components";
import { getFirestore, collection, onSnapshot, query, orderBy, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { motion, AnimatePresence, useViewportScroll } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";


const Wrapper = styled.div`
    height: 90vh;
    width: 100vw;
    margin-top: 60px;
    display: flex;
    justify-content: center;
`

const SessionBox = styled.div`
    margin: 10% 0;
    width: 60%;
    height: 100vh;
    display: flex;
    flex-direction: column;
`

const Profile = styled(motion.div)`
    width: 100%;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    border-radius: 15px;
    box-shadow: rgba(0, 0, 0, 0.25) 0px 25px 50px -12px;
    margin-bottom: 10%;
`

const ProfilePoto = styled.img`
    width: 110px;
    height: 110px;
    border-radius: 110px;
`
const ProfileName = styled.div`

`

const ProfiletSession = styled.div`
    display: flex;
    div{
        margin-right: 7px;
    }
`

const Overlay = styled(motion.div)`
    position: fixed;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.75);
    opacity: 0;
`

const BigProfile = styled(motion.div)`
    background-color: white;
    width: 80%;
    height: 80%;
    border-radius: 10px;
    position: relative;
    display: flex;
    flex-direction: column;
`

interface SnapshotData {
    artist: string;
    createdAt: number;
    creatorId: string;
    genre: [];
    id: string;
    instrument: [];
    introduce: string;
    music: string;
    name: string;
    poto: string;
}


function Session() {
    const dbService = getFirestore();
    const [clickBox, setClickBox] = useState(false);
    const [profileArray, setProfileArray] = useState<SnapshotData[]>([]);
    const [clickDb, setClickDb] = useState<SnapshotData>();

    const profileClick = (prev:SnapshotData) => {
        setClickDb(prev);
        setClickBox(true);
    }

    useEffect(() => {
        const dbAllProfile = query(collection(dbService, "profiles"),orderBy("createdAt", "desc"));

        const snapshot = (snapshot : any) => {
            const newProfile = snapshot.docs.map((doc : any) => ({
            ...doc.data()
        }));
        setProfileArray(newProfile);
        }
        onSnapshot(dbAllProfile, snapshot);
    },[]);
    console.log(profileArray);
    console.log("clickDb : ", clickDb);
    

    return (
        <Wrapper>
            <SessionBox>
                {profileArray.map((prev) => <Profile layoutId={prev.creatorId} key={prev.creatorId} onClick={() => profileClick(prev)}>
                    <ProfilePoto src={prev.poto}/>
                    <ProfileName>{prev.name}</ProfileName>
                    <ProfiletSession>
                        {prev.instrument.map(prev => <div>{prev}</div>)}
                    </ProfiletSession>
                </Profile>)}
            </SessionBox>
            <AnimatePresence>
            {clickBox ? (
              <>
                <Overlay onClick={()=> setClickBox(false)} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <BigProfile layoutId={clickDb?.creatorId}>
                        <div>하이</div>
                    </BigProfile>
                </Overlay>
              </>
            ) : null}
          </AnimatePresence>
        </Wrapper>
    );
}

export default Session;