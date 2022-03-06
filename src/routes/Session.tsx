import styled from "styled-components";
import { getFirestore, collection, onSnapshot, query, orderBy} from "firebase/firestore";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";


const Wrapper = styled.div`
    height: 90vh;
    width: 100vw;
    margin-top: 60px;
    display: flex;
    justify-content: center;
`

const SessionBox = styled.div`
    margin: 5% 0;
    width: 60%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
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
    cursor: pointer;
    &:hover{
        transition: 0.3s ease-in-out;
        box-shadow: rgba(0, 0, 0, 0.2) 0px 60px 40px -7px;
    }
    &:not(:hover){
        transition: 0.3s ease-in-out;
        box-shadow: rgba(0, 0, 0, 0.25) 0px 25px 50px -12px;

    }
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
    width: 50%;
    height: 80%;
    border-radius: 10px;
    position: relative;
    display: flex;
    flex-direction: column;
`

const BigItem = styled.div`
    margin: 5% 15%;
`

const BigHeadItem = styled(BigItem)`
    margin-top: 10%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    div{
        margin-right: 10%;
    }
`

const Img = styled.img`
    width: 150px;
    height: 150px;
    border-radius: 20px;
`

const Introduce = styled.div`

`

const Tag = styled.div`

`

const Title = styled.div`
    font-size: 48px;
    font-weight: 600;
    margin-bottom: 50px;
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
    instarId : string
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
                <Title>매칭 세션</Title>
                {profileArray.map((prev) => <Profile key={prev.creatorId} onClick={() => profileClick(prev)}>
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
                <Overlay onClick={()=> setClickBox(false)} animate={{ opacity: 1 }} transition={{duration: 0.5}} exit={{ opacity: 0 }}>
                    <BigProfile>
                        {clickBox ? <><BigHeadItem>
                            <Img src={clickDb?.poto}></Img>
                            <Introduce>{clickDb?.introduce}</Introduce>
                        </BigHeadItem>
                        <BigItem>
                            <Tag>이름 : </Tag>
                            {clickDb?.name}
                        </BigItem>
                        <BigItem>
                            <Tag>세션 : </Tag>
                            {clickDb?.instrument.map(prev => <span>{prev}</span>)}
                        </BigItem>
                        <BigItem>
                            <Tag>선호하는 장르 : </Tag>
                            {clickDb?.genre.map(prev => <span>{prev}</span>)}
                        </BigItem>
                        <BigItem>
                            <Tag>좋아하는 아티스트 : </Tag>
                            {clickDb?.artist}
                        </BigItem>
                        <BigItem>
                            <Tag>하고 싶은 곡 : </Tag>
                            {clickDb?.music}
                        </BigItem>
                        <BigItem>
                            <Tag>Contact with Instargram : </Tag>
                            {clickDb?.instarId}
                        </BigItem>
                        </> : null}
                    </BigProfile>
                </Overlay>
              </>
            ) : null}
          </AnimatePresence>
        </Wrapper>
    );
}

export default Session;