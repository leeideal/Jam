import styled from "styled-components";
import { getFirestore, collection, onSnapshot, query, orderBy, deleteDoc, doc} from "firebase/firestore";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { faArrowAltCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


const Wrapper = styled.div`
    width: 100vw;
    margin-top: 60px;
    display: flex;
    justify-content: center;
`

const SessionBox = styled.div`
    margin-top: 50px;
    width: 100vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start ;
`

const Profile = styled(motion.div)`
    @media screen and (min-width: 360px) {
        width: 90%;
    }
    @media screen and (min-width: 700px) {
        width: 87%;
    }
    @media screen and (min-width: 1000px) {
        width: 80%
    }
    width: 80%;
    height: 130px;
    display: flex;
    align-items: center;
    background-color: white ;
    border-radius: 15px;
    box-shadow: rgba(0, 0, 0, 0.25) 0px 25px 50px -12px;
    margin-top: 4%;
    margin-bottom: 4%;
    position: relative;
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
    @media screen and (min-width: 360px) {
        width: 70px;
        height: 70px;
        border-radius: 70px;
    }
    @media screen and (min-width: 700px) {
        width: 90px;
        height: 90px;
        border-radius: 90px;
    }
    @media screen and (min-width: 1000px) {
        width: 110px;
        height: 110px;
        border-radius: 110px;
    }
    position : absolute;
    left: 5%;
    width: 110px;
    height: 110px;
    border-radius: 110px;
`
const ProfileName = styled.div`
    @media screen and (max-width: 699px) {
        left: 35%;
    }
    @media screen and (min-width: 360px) {
        font-size: 16px;
    }
    @media screen and (min-width: 700px) {
        font-size: 18px;
    }
    @media screen and (min-width: 1000px) {
        font-size: 20px;
    }
    position : absolute;
    left: 24%;
    font-size: 20px;
`

const ProfiletSession = styled.div`
    display: flex;
    position : absolute;
    left: 36%;
    @media screen and (max-width: 699px) {
            left: 55%;
    }
    div{
        @media screen and (min-width: 360px) {
        font-size: 13px;
        }
        @media screen and (min-width: 700px) {
            font-size: 14px;
        }
        @media screen and (min-width: 1000px) {
            font-size: 18px;
        }
        margin-right: 10px;
        font-size: 18px;
        background-color:  #dfe6e9;
        padding: 5px;
        border-radius: 5px;
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
    z-index: 30;
`

const BigProfile = styled(motion.div)`
    @media screen and (min-width: 360px) {
        width: 90%;

    }
    @media screen and (min-width: 700px) {
        width: 70%;
    }
    @media screen and (min-width: 1000px) {
        width: 60%;
    }
    @media screen and (min-width: 1500px) {
        width: 50%;
    }
    @media screen and (min-width: 2000px) {
        width: 40%;
    }
    background-color: white;
    width: 50%;
    height: 90%;
    border-radius: 20px;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center ;
    z-index: 30;
`

const BigItem = styled.div`
    background-color: #eae9ee;
    display: flex ;
    flex-direction: column ;
    justify-content: center;
    height: 100%;
    &:first-child{
        border-top-left-radius: 20px;
    }
    &:nth-child(2){
        border-top-right-radius: 20px;
    }
    &:nth-child(3) {
        border-bottom-left-radius: 20px;
        div:nth-child(2){
            display: flex;
            flex-direction: column;
            span{
                margin-bottom: 1.5%;
            }
        }
    }
    &:nth-child(4){
        border-bottom-right-radius: 20px;
        div:nth-child(2){
            display: flex;
            flex-direction: column;
            span{
                margin-bottom: 1.5%;
            }
        }
    }
`

const BigBasicInfo = styled.div`
    position: absolute;
    top: 18%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center ;
`

const Img = styled.img`
    @media screen and (min-width: 360px) {
        margin-bottom: 7%;
        width: 140px;
        height: 140px;
    }
    @media screen and (min-width: 700px) {
        margin-bottom: 7%;
        width: 170px;
        height: 170px;
    }
    @media screen and (min-width: 900px) {
        margin-bottom: 6%;
    }
    @media screen and (min-width: 1150px) {
        margin-bottom: 5%;
    }
    @media screen and (min-width: 1500px) {
        margin-bottom: 4%;
    }
    @media screen and (max-height: 900px) {
        margin-top: -20px;
        margin-bottom: 2%;
    }
    width: 200px;
    height: 200px;
    border-radius: 20px;
    margin-bottom: 5%;
`

const Introduce = styled.div`
    width: 60%;
    text-align: center;
    font-size:18px ;
`

const Tag = styled.div`
    @media screen and (min-width: 360px) {
        font-size: 13px ;

    }
    @media screen and (min-width: 700px) {
        font-size: 14px ;
    }
    margin-left: 15%;
    font-size: 15px ;
    color: rgba(0,0,0,0.4);
    margin-bottom: 5%;
`

const Title = styled.div`
    font-size: 48px;
    font-weight: 600;
    margin-bottom: 50px;
`

const SessionInerBox = styled.div`
    @media screen and (min-width: 360px) {
        width: 90%;
    }
    @media screen and (min-width: 700px) {
        width: 87%;
    }
    @media screen and (min-width: 1000px) {
        width: 80%
    }
    @media screen and (min-width: 1600px) {
        width: 70%;
    }
    @media screen and (min-width: 2000px) {
        width: 60%;
    }
    width: 80% ;
    background-color: #eae9ee;
    border-radius: 15px;
    display: flex;
    flex-direction: column ;
    align-items: center ;
`

const ProfileGenre = styled.div`
    position : absolute;
    left: 65%;
    display:flex ;
    div{
        @media screen and (max-width: 699px) {
            display: none;
        }
        @media screen and (min-width: 700px) {
            font-size: 14px;
        }
        @media screen and (min-width: 1000px) {
            font-size: 18px;
        }
        margin-right: 10px;
        background-color:  #91c5f2;
        color: white;
        font-size: 18px;
        padding: 5px;
        border-radius: 5px;
    }
`
const BigHead = styled.div`
    width:100%;
    height: 12%;
    background-color:  #91c5f2;
    border-top-left-radius: 20px ;
    border-top-right-radius : 20px;
    display: flex;
    align-items:center ;
    position: relative;
    div{
        font-size: 32px;
        color: white;
        font-weight: 500;
        margin-left: 9% ;
    }
`

const BigName= styled.div`
    @media screen and (min-width: 1500px) {
        margin-bottom: 1.5%;
    }
    @media screen and (min-width: 2000px) {
        margin-bottom: 1.5%;
    }
    font-size: 24px ;
    font-weight: 400;
    margin-bottom: 2%;
`

const BigMainInfo = styled.div`
    @media screen and (max-height: 900px) {
        top: 57%;
    }
    position: absolute;
    top: 54%;
    width: 80%;
    display: grid ;
    grid-template-columns: repeat(2, 1fr);
    background-color: white;
    gap: 3px;
    height: 25%;
`

const BigContact = styled.div`
    position: absolute ;
    display: flex;
    justify-content: center ;
    align-items: center;
    flex-direction: column ;
    bottom: 0;
    width: 100%;
    height: 12%;
    background-color: #eae9ee;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    div{
        color: rgba(0,0,0,0.4);
        margin-bottom: 1%;
    }
    a{
        font-size: 18px;
    }
`

const BigItems = styled.div`
    @media screen and (min-width: 360px) {
        font-size: 14px ;

    }
    @media screen and (min-width: 700px) {
        font-size: 16px ;
    }
    margin-left: 15%;
    margin-right: 5%;
    span{
        margin-right: 5px;
    }
`

const BigContact2 = styled.div`
    position: absolute ;
    display: flex;
    justify-content: center ;
    align-items: center;
    bottom: 0;
    width: 100%;
    height: 12%;
    background-color: #eae9ee;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    form{
        input{
            padding: 3px;
            border: none;
            border-radius: 7px;
            background-color: #91c5f2;
            color: white;
            font-size: 18px;
            &:hover{
            transition: 0.4s ease-in-out;
            background-color: white;
            border : 1px solid   #91c5f2;
            color:  #91c5f2;
            }
            &:not(:hover){
                transition: 0.4s ease-in-out;
                background-color: #91c5f2;
                color: white;
            }
        }
    }
    
`

const NoMobile = styled.div`
    @media screen and (min-width: 350px) and (min-height:540px)  {
        display: none;
  }
  position: absolute;
  z-index: 99;
  height: 400%;
  background-color: #263238;
  color : white;
  width: 100vw;
  display: flex;
  top: 0;
  justify-content: center;
  padding-top: 50px;
  align-items: flex-start;
  font-size: 26px;
`


interface SnapshotData {
    artist: [];
    createdAt: number;
    creatorId: string;
    genre: [];
    id: string;
    instrument: [];
    introduce: string;
    music: [];
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
    
    const onDelete = async(event : any) => {
        event.preventDefault();
        try{
            await deleteDoc(doc(dbService, "profiles", `${clickDb!.creatorId}`));
            setClickBox(false);
        }catch(error){
            window.alert("문제가 발생했습니다. 다시시도해 주세요.")
            console.log(error);
        }

    }

    return (
        <Wrapper>
            <SessionBox>
                <Title>매칭 세션</Title>
                <SessionInerBox>
                    {profileArray.map((prev) => <Profile key={prev.creatorId} onClick={() => profileClick(prev)}>
                        <ProfilePoto src={prev.poto}/>
                        <ProfileName>{prev.name}</ProfileName>
                        <ProfiletSession>
                            {prev.instrument.map(prev => <div>{prev}</div>)}
                        </ProfiletSession>
                        <ProfileGenre>
                            {prev.genre.map(prev=><div>{prev}</div>)}
                        </ProfileGenre>
                    </Profile>)}
                </SessionInerBox>
            </SessionBox>
            <AnimatePresence>
            {clickBox ? (
              <>
                <Overlay animate={{ opacity: 1 }} transition={{duration: 0.5}} exit={{ opacity: 0 }}>
                    <BigProfile>
                    <FontAwesomeIcon onClick={()=> setClickBox(false)} style={{position : "absolute" , top : "4%", right: "7%", zIndex : 3}} icon={faArrowAltCircleLeft} size="2x"/>
                        <BigHead>
                            <div>Profile</div>
                        </BigHead>
                        <BigBasicInfo>
                            <Img src={clickDb?.poto}></Img>
                            <BigName>{clickDb?.name}</BigName>
                            <Introduce>{clickDb?.introduce}</Introduce>
                        </BigBasicInfo>
                        <BigMainInfo>
                            <BigItem>
                                <Tag>Session</Tag>
                                <BigItems>{clickDb?.instrument.map(prev => <span>{prev}</span>)}</BigItems>
                            </BigItem>
                            <BigItem>
                                <Tag>Music Genre</Tag>
                                <BigItems>{clickDb?.genre.map(prev => <span>{prev}</span>)}</BigItems>
                            </BigItem>
                            <BigItem>
                                <Tag>Favorite Artist</Tag>
                                <BigItems>{clickDb?.artist.map(prev => <span>{prev}</span>)}</BigItems>
                            </BigItem>
                            <BigItem>
                                <Tag>A Music Want To Play</Tag>
                                <BigItems>{clickDb?.music.map(prev => <span>{prev}</span>)}</BigItems>
                            </BigItem>
                        </BigMainInfo>
                        {clickDb?.creatorId === localStorage.getItem("uid") ?
                            <BigContact2> 
                                <form onSubmit={onDelete}>
                                    <input type="submit" value={"삭제하기"} ></input>
                                </form>
                            </BigContact2>
                            : 
                            <BigContact>
                                <div>Contact with Instargram</div>
                                <a href="https://www.instagram.com/?hl=ko">{clickDb?.instarId}</a> 
                            </BigContact> }
                    </BigProfile>
                </Overlay>
              </>
            ) : null}
          </AnimatePresence>
          <NoMobile>화면이 너무 작습니다.<br></br> 
            노트북이나 컴퓨터로 접속을 권장합니다.</NoMobile>
        </Wrapper>
    );
}

export default Session;