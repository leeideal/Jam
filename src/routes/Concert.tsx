import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { faArrowAltCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {useForm} from "react-hook-form"
import { getFirestore, setDoc, collection, doc, updateDoc, onSnapshot, query, orderBy, deleteDoc } from "firebase/firestore";
import { useRecoilValue } from "recoil";
import { isLogin, user } from "../atom";
import { Link } from "react-router-dom";

interface IForm {
    name: string;
    session: any;
    genre: any;
    place: string;
    music: string;
    introduce: string;
    instarId : string;
}

interface IDb {
    createdAt: number,
    creatorId: string,
    name: string;
    session: any;
    genre: any;
    place: any;
    music: any;
    introduce: string;
    instarId : string;
}

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

const ShowTeam = styled.div`
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
    width: 90% ;
    background-color: #eae9ee;
    border-radius: 15px;
    display: flex;
    flex-direction: column ;
    align-items: center ;
`

const CreateTeam = styled.div`
`

const Button = styled.button`
    @media screen and (max-width: 450px) {
        padding: 0 0.3em ;
    }
    margin-top: 100px;
    background:#8fc4ee;
    color:#fff;
    border:none;
    position:relative;
    height:40px;
    font-size:1.6em;
    padding:0 1em;
    cursor:pointer;
    transition:800ms ease all;
    outline:none;
    &:hover{
        background:#fff;
        color:#8fc4ee;
    }
    &:before, &:after{
        content:'';
        position:absolute;
        top:0;
        right:0;
        height:2px;
        width:0;
        background: #8fc4ee;
        transition:400ms ease all;
    }
    &:after{
        right:inherit;
        top:inherit;
        left:0;
        bottom:0;
    }
    &:hover:before,&:hover:after{
        width:100%;
        transition:800ms ease all;
    }
`

const Title = styled.div`
    font-size: 48px;
    font-weight: 600;
    margin-bottom: 50px;
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

const BigCreatTeam = styled(motion.div)`
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
    justify-content:flex-start;
`

const CreatTeamTitle = styled(Title)`
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

const CreateTeamSubmit = styled.form`
    margin-top: -40px ;
`

const CreatItem = styled.div`

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

const Team = styled.input`
    @media screen and (min-width: 360px) {

    }
    @media screen and (min-width: 700px) {
    }
    margin: 0 5%;
    margin-bottom: 1.5%;
`

const TeamCheckBox = styled.input`
    margin: 0 5%;
    margin-bottom: 2%;
`

const Submit = styled.input`
    width: 60px;
`

const Teamfile = styled(motion.div)`
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

const TeamName = styled.div`
    @media screen and (min-width: 360px) {
        font-size: 20px;
        font-weight: 600;
        }
        @media screen and (min-width: 700px) {
            font-size: 23px;
            font-weight: 600;
        }
        @media screen and (min-width: 1000px) {
            font-size: 26px;
            font-weight: 500;
        }
    position : absolute;
    left: 5%;
    font-size: 26px;
    font-weight: 500;
`

const TeamGenre = styled(motion.div)`
    display: flex;
    position : absolute;
    left: 24%;
    @media screen and (max-width: 770px) {
            display: none;
    }
    @media screen and (min-width: 2000px) {
            left: 31%;
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

const Bigteam = styled(motion.div)`
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
    height: 80%;
    border-radius: 20px;
    position: relative;
    display: flex;
    flex-direction: column;
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


const TeamMusic = styled.div`
    position : absolute;
    left: 60%;
    display:flex ;
    @media screen and (max-width: 770px) {
        left: 40%;
        }
    @media screen and (min-width: 2000px) {
            left: 65%;
        }
    div{
        @media screen and (max-width: 699px) {
            font-size : 13px;
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

const BigBasicInfo = styled.div`
    position: absolute;
    top: 20%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center ;
`

const BigName= styled.div`
    @media screen and (min-width: 1500px) {
        margin-bottom: 2.5%;
    }
    @media screen and (min-width: 2000px) {
        margin-bottom: 2%;
    }
    font-size: 40px ;
    font-weight: 500;
    margin-bottom: 3%;
`
const Introduce = styled.div`
    width: 60%;
    text-align: center;
    font-size:18px ;
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

const BigMainInfo = styled.div`
    position: absolute;
    top: 48%;
    margin: 0 10%;
    width: 80%;
    display: grid ;
    grid-template-columns: repeat(2, 1fr);
    background-color: white;
    gap: 3px;
    height: 25%;
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

const BigContact2 = styled.div`
    position: absolute ;
    display: flex;
    justify-content: center;
    align-items: center;
    bottom: 0;
    width: 100%;
    height: 12%;
    background-color: #eae9ee;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    button{
            @media screen and (max-width: 700px) {
                font-size: 16px ;
            }
            margin-right:10px ;
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
    form{
        input{
            margin-left:10px ;
            @media screen and (max-width: 700px) {
                font-size: 16px ;
            }
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

const CreatContact = styled.div`
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
        input{
            width: 90px;
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
`

const CreatTeamTag = styled.div`
    @media screen and (min-width: 360px) {
        font-size: 13px ;

    }
    @media screen and (min-width: 700px) {
        font-size: 14px ;
    }
    margin: 0 5%;
    font-size: 15px ;
    color: rgba(0,0,0,0.4);
    margin-bottom: 1.5%;
`

const FalseWrapper = styled(Wrapper)`
    display: flex;
    width:100% ;
    height: 100%;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

const NoMobile = styled.div`
    @media screen and (min-width: 350px) and (min-height:540px) {
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



function Concert() {
    const [creatTeam, setCreatTeam] = useState(false);
    const {register,  handleSubmit, setValue} = useForm<IForm>();
    const userObj = useRecoilValue(user);
    const dbService = getFirestore();
    const [teamArray, setTeamArray] = useState<IDb[]>([]);
    const [clickBox, setClickBox] = useState(false);
    const [clickDb, setClickDb] = useState<IDb>();
    const [fixTeam, setFixTeam] = useState(false);
    const checkLog = useRecoilValue(isLogin);


    const onValid = async (data : IForm) => {
        console.log("hello")
        const check = (str:string) => {
            if (str.split(',').length - 1 === 1){
                var patt1 =  /[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|]+[ ]*[-]+[ ]*[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|]+[ ]*[,]+[ ]*[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|]+[ ]*[-]+[ ]*[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|]+/g;
                const result1 = patt1.test(str);
                return result1;
            }else if(str.split(',').length - 1 > 1){
                window.alert("입력값 조건을 확인바랍니다.")
            }else if(str.includes(",") === false){
                var patt =  /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|]+[ ]*[-]+[ ]*[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|]+$/g;
                const result = patt.test(str);
                return result
            }
        }
        const checkResult = check(data.music);
        if (checkResult === false){
            window.alert("입력내용을 다시 확인해주세요.");
            return null
        }
        try {
            const dataObj = {
                creatorId: userObj.uid,
                createdAt: Date.now(),
                name: data.name,
                session: data.session,
                genre: data.genre,
                place: data.place.split(","),
                music: data.music.split(","),
                introduce: data.introduce,
                instarId : data.instarId
            }

            await setDoc(doc(collection(dbService, "teams"), `${Date.now()}`), dataObj);

            setValue("name", "");
            setValue("genre", "");
            setValue("session", "");
            setValue("place", "");
            setValue("music", "");
            setValue("introduce", "");
            setValue("instarId", "");



            setCreatTeam(false);

            window.alert("팀이 생성되었습니다!");
        }catch(error){
            window.alert("문제가 발생했습니다. 다시시도해 주세요.")
            console.log(error);
        }
    }

    const unValid = () => {
        console.log("!!!!!!!!!");
    }
    
    const onDelete = async() => {
        try{
            await deleteDoc(doc(dbService, "teams", `${clickDb!.createdAt}`));
            setClickBox(false);
        }catch(error){
            window.alert("문제가 발생했습니다. 다시시도해 주세요.")
            console.log(error);
        }
    }

    const onFixValid = async(data : IForm) =>{
        console.log("Fix hello")
        const check = (str:string) => {
            if (str.split(',').length - 1 === 1){
                var patt1 =  /[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|]+[ ]*[-]+[ ]*[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|]+[ ]*[,]+[ ]*[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|]+[ ]*[-]+[ ]*[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|]+/g;
                const result1 = patt1.test(str);
                return result1;
            }else if(str.split(',').length - 1 > 1){
                window.alert("입력값 조건을 확인바랍니다.")
            }else if(str.includes(",") === false){
                var patt =  /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|]+[ ]*[-]+[ ]*[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|]+$/g;
                const result = patt.test(str);
                return result
            }
        }
        const checkResult = check(data.music);
        if (checkResult === false){
            window.alert("입력내용을 다시 확인해주세요.");
            return null
        }
        try {
            const dataObj = {
                creatorId: userObj.uid,
                name: data.name,
                session: data.session,
                genre: data.genre,
                place: data.place.split(","),
                music: data.music.split(","),
                introduce: data.introduce,
                instarId : data.instarId
            }

            await updateDoc(doc(dbService, "teams", `${clickDb!.createdAt}`), dataObj);

            setValue("name", "");
            setValue("genre", "");
            setValue("session", "");
            setValue("place", "");
            setValue("music", "");
            setValue("introduce", "");
            setValue("instarId", "");


            window.alert("수정되었습니다!");

            setFixTeam(false);
            setClickBox(false);

        }catch(error){
            window.alert("문제가 발생했습니다. 다시시도해 주세요.")
            console.log(error);
        }
    }

    useEffect(() => {
        const dbAllProfile = query(collection(dbService, "teams"),orderBy("createdAt", "desc"));

        const snapshot = (snapshot : any) => {
            const newTeam = snapshot.docs.map((doc : any) => ({
            ...doc.data()
        }));
        setTeamArray(newTeam);
        }
        onSnapshot(dbAllProfile, snapshot);
    },[creatTeam]);
    console.log(clickDb);

    const TeamClick = (prev:IDb) => {
        setClickDb(prev);
        setClickBox(true);
    }

    const clickFix = () => {
        setFixTeam(true)
        setValue("name", clickDb!.name);
        setValue("genre", clickDb!.genre);
        setValue("session", clickDb!.session);
        setValue("music", clickDb!.music.join(","));
        setValue("place", clickDb!.place.join(","));
        setValue("introduce", clickDb!.introduce);
        setValue("instarId", clickDb!.instarId);
    }

    const btnClick = () => {
        setCreatTeam(true)
        setValue("name", "");
        setValue("genre", "");
        setValue("session", "");
        setValue("place", "");
        setValue("music", "");
        setValue("introduce", "");
        setValue("instarId", "");
    }


    return (
        <Wrapper>
            <SessionBox>
                <Title>합주 팀</Title>
                <ShowTeam>
                    {teamArray.map((prev) => <Teamfile key={prev.createdAt} onClick={() => TeamClick(prev)}>
                    <TeamName>{prev.name}</TeamName>
                    <TeamGenre>
                        {prev.genre.map((prev:string) => <div>{prev}</div>)}
                    </TeamGenre>
                    <TeamMusic>
                        {prev.music.map((prev:string) => <div>{prev}</div>)}
                    </TeamMusic>
                </Teamfile>)}
                </ShowTeam>
                <CreateTeam>
                    <Button onClick={btnClick}>{creatTeam ? null: "Jam 만들기"}</Button>
                </CreateTeam>
            </SessionBox>
            <AnimatePresence>
            {clickBox ? (
            // Team 정보 창
              <>
                <Overlay animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <Bigteam >
                    <FontAwesomeIcon onClick={()=> {setClickBox(false)
                    setFixTeam(false)}} style={{position : "absolute" , top : "4%", right: "7%", zIndex : 3}} icon={faArrowAltCircleLeft} size="2x"/>
                        {clickBox ? fixTeam ? 
                        // Team 정보 수정화면
                        <>
                            <CreatTeamTitle><div>Revise Jam</div></CreatTeamTitle>
                                <CreateTeamSubmit onSubmit={handleSubmit(onFixValid, unValid)}>
                                    <CreatItem>
                                        <CreatTeamTag>Team</CreatTeamTag>
                                        <Team {...register("name", {required : true,})} type="text" maxLength={10}/>
                                    </CreatItem>
                                    <CreatItem>
                                        <CreatTeamTag>Music Genre (최대 3개)</CreatTeamTag>
                                        <TeamCheckBox {...register("genre", {required : true,})} type="checkbox" value="발라드"/>
                                        <label htmlFor="발라드">발라드</label>
                                        <TeamCheckBox {...register("genre", {required : true,})} type="checkbox" value="POP" />
                                        <label htmlFor="POP">POP</label>
                                        <TeamCheckBox {...register("genre", {required : true,})} type="checkbox" value="K-POP" />
                                        <label htmlFor="K-POP">K-POP</label>
                                        <TeamCheckBox {...register("genre", {required : true,})} type="checkbox" value="랩/힙합" />
                                        <label htmlFor="랩/힙합">랩/힙합</label>
                                        <TeamCheckBox {...register("genre", {required : true,})} type="checkbox" value="RnB/Soul" />
                                        <label htmlFor="RnB/Soul">RnB/Soul</label>
                                        <TeamCheckBox {...register("genre", {required : true,})} type="checkbox" value="인디음악" />
                                        <label htmlFor="인디음악">인디음악</label>
                                        <TeamCheckBox {...register("genre", {required : true,})} type="checkbox" value="록/메탈" />
                                        <label htmlFor="록/메탈">록/메탈</label>
                                        <TeamCheckBox {...register("genre", {required : true,})} type="checkbox" value="포크/블루스" />
                                        <label htmlFor="포크/블루스">포크/블루스</label>
                                    </CreatItem>
                                    <CreatItem>
                                        <CreatTeamTag>Team Session</CreatTeamTag>
                                        <TeamCheckBox {...register("session", {required : true,})} type="checkbox" value="보컬" />
                                        <label htmlFor="보컬">보컬</label>
                                        <TeamCheckBox {...register("session", {required : true,})} type="checkbox" value="통기타" />
                                        <label htmlFor="통기타">통기타</label>
                                        <TeamCheckBox {...register("session", {required : true,})} type="checkbox" value="일렉기타" />
                                        <label htmlFor="일렉기타">일렉기타</label>
                                        <TeamCheckBox {...register("session", {required : true,})} type="checkbox" value="베이스" />
                                        <label htmlFor="베이스">베이스</label>
                                        <TeamCheckBox {...register("session", {required : true,})} type="checkbox" value="키보드" />
                                        <label htmlFor="키보드">키보드</label>
                                        <TeamCheckBox {...register("session", {required : true,})} type="checkbox" value="신디사이저" />
                                        <label htmlFor="신디사이저">신디사이저</label>
                                        <TeamCheckBox {...register("session", {required : true,})} type="checkbox" value="드럼" />
                                        <label htmlFor="드럼">드럼</label>
                                    </CreatItem>
                                    <CreatItem>
                                        <CreatTeamTag>A Music Want To Play ("가수 - 노래, ... "와 같이 최대 2곡)</CreatTeamTag>
                                        <Team {...register("music", {required : true,})} type="text"/>
                                    </CreatItem>
                                    <CreatItem>
                                        <CreatTeamTag>Place</CreatTeamTag>
                                        <Team {...register("place", {required : true,})} type="text"/>
                                    </CreatItem>
                                    <CreatItem>
                                        <CreatTeamTag>Team Introduction</CreatTeamTag>
                                        <Team {...register("introduce", {required : true,})} type="text" maxLength={20}/>
                                    </CreatItem>
                                    <CreatItem>
                                        <CreatTeamTag>Team leader's Instagram ID</CreatTeamTag>
                                        <Team {...register("instarId", {required : true,})} type="text" />
                                    </CreatItem>
                                    <CreatContact> 
                                        <Submit type = "submit" value="수정완료"/>
                                    </CreatContact> 
                                </CreateTeamSubmit>
                        </> 
                        
                        // Team 정보 화면
                        : 
                        <>
                        <BigHead>
                            <div>Team</div>
                        </BigHead>
                        <BigBasicInfo>
                            <BigName>{clickDb?.name}</BigName>
                            <Introduce>{clickDb?.introduce}</Introduce>
                        </BigBasicInfo>
                        <BigMainInfo>
                            <BigItem>
                                <Tag>Team Session</Tag>
                                <BigItems>{clickDb?.session.map((prev:string) => <span>{prev}</span>)}</BigItems>
                            </BigItem>
                            <BigItem>
                                <Tag>Music Genre</Tag>
                                <BigItems>{clickDb?.genre.map((prev:string) => <span>{prev}</span>)}</BigItems>
                            </BigItem>
                            <BigItem>
                                <Tag>A Music Want To Play</Tag>
                                <BigItems>{clickDb?.music.map((prev:string) => <span>{prev}</span>)}</BigItems>
                            </BigItem>
                            <BigItem>
                                <Tag>Place</Tag>
                                <BigItems>{clickDb?.place.map((prev:string) => <span>{prev}</span>)}</BigItems>
                            </BigItem>
                        </BigMainInfo>
                            {clickDb?.creatorId === localStorage.getItem("uid") ?
                            <BigContact2> 
                                <button onClick={clickFix}>수정하기</button> 
                                <form onSubmit={handleSubmit(onDelete, unValid)}>
                                    <input type="submit" value={"삭제하기"} ></input>
                                </form> 
                            </BigContact2>
                            : 
                            <BigContact>
                                <div>Contact with Instargram</div>
                                <a href="https://www.instagram.com/?hl=ko">{clickDb?.instarId}</a> 
                            </BigContact> }
                        </> : null}
                    </Bigteam>
                </Overlay>
              </>
            ) : null}
          </AnimatePresence>
            <AnimatePresence>
                    {creatTeam ? checkLog ? (
                    <>
                        <Overlay animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <BigCreatTeam>
                                <FontAwesomeIcon onClick={()=>setCreatTeam(false)} style={{position : "absolute" , top : "4%", right: "7%", zIndex : 3}} icon={faArrowAltCircleLeft} size="2x"/>
                                <CreatTeamTitle><div>Create Jam</div></CreatTeamTitle>
                                <CreateTeamSubmit onSubmit={handleSubmit(onValid, unValid)}>
                                    <CreatItem>
                                        <CreatTeamTag>Team</CreatTeamTag>
                                        <Team {...register("name", {required : true,})} type="text" maxLength={10} placeholder="최대 10자"/>
                                    </CreatItem>
                                    <CreatItem>
                                        <CreatTeamTag>Music Genre (최대 3개)</CreatTeamTag>
                                        <TeamCheckBox {...register("genre", {required : true,})} type="checkbox" value="발라드"/>
                                        <label htmlFor="발라드">발라드</label>
                                        <TeamCheckBox {...register("genre", {required : true,})} type="checkbox" value="POP" />
                                        <label htmlFor="POP">POP</label>
                                        <TeamCheckBox {...register("genre", {required : true,})} type="checkbox" value="K-POP" />
                                        <label htmlFor="K-POP">K-POP</label>
                                        <TeamCheckBox {...register("genre", {required : true,})} type="checkbox" value="랩/힙합" />
                                        <label htmlFor="랩/힙합">랩/힙합</label>
                                        <TeamCheckBox {...register("genre", {required : true,})} type="checkbox" value="RnB/Soul" />
                                        <label htmlFor="RnB/Soul">RnB/Soul</label>
                                        <TeamCheckBox {...register("genre", {required : true,})} type="checkbox" value="인디음악" />
                                        <label htmlFor="인디음악">인디음악</label>
                                        <TeamCheckBox {...register("genre", {required : true,})} type="checkbox" value="록/메탈" />
                                        <label htmlFor="록/메탈">록/메탈</label>
                                        <TeamCheckBox {...register("genre", {required : true,})} type="checkbox" value="포크/블루스" />
                                        <label htmlFor="포크/블루스">포크/블루스</label>
                                    </CreatItem>
                                    <CreatItem>
                                        <CreatTeamTag>Team Session</CreatTeamTag>
                                        <TeamCheckBox {...register("session", {required : true,})} type="checkbox" value="보컬"/>
                                        <label htmlFor="보컬">보컬</label>
                                        <TeamCheckBox {...register("session", {required : true,})} type="checkbox" value="통기타"/>
                                        <label htmlFor="통기타">통기타</label>
                                        <TeamCheckBox {...register("session", {required : true,})} type="checkbox" value="일렉기타"/>
                                        <label htmlFor="일렉기타">일렉기타</label>
                                        <TeamCheckBox {...register("session", {required : true,})} type="checkbox" value="베이스"/>
                                        <label htmlFor="베이스">베이스</label>
                                        <TeamCheckBox {...register("session", {required : true,})} type="checkbox" value="키보드"/>
                                        <label htmlFor="키보드">키보드</label>
                                        <TeamCheckBox {...register("session", {required : true,})} type="checkbox" value="신디사이저"/>
                                        <label htmlFor="신디사이저">신디사이저</label>
                                        <TeamCheckBox {...register("session", {required : true,})} type="checkbox" value="드럼"/>
                                        <label htmlFor="드럼">드럼</label>
                                    </CreatItem>
                                    <CreatItem>
                                        <CreatTeamTag>A Music Want To Play ("가수 - 노래, ... "와 같이 최대 2곡)</CreatTeamTag>
                                        <Team {...register("music", {required : true,})} type="text"  placeholder="예) 아이유 - 삐삐, 백예린-Square"/>
                                    </CreatItem>
                                    <CreatItem>
                                        <CreatTeamTag>Place</CreatTeamTag>
                                        <Team {...register("place", {required : true,})} type="text" placeholder="예) 서울 중구, 서울 종로구"/>
                                    </CreatItem>
                                    <CreatItem>
                                        <CreatTeamTag>Team Introduction</CreatTeamTag>
                                        <Team {...register("introduce", {required : true,})} type="text" maxLength={20} style={{width:"50%"}} placeholder="20자 이내"/>
                                    </CreatItem>
                                    <CreatItem>
                                        <CreatTeamTag>Team leader's Instagram ID</CreatTeamTag>
                                        <Team {...register("instarId", {required : true,})} type="text" placeholder="lee_sang1124"/>
                                    </CreatItem>
                                    <CreatContact> 
                                        <Submit type = "submit" value="팀 만들기"/>
                                    </CreatContact> 
                                </CreateTeamSubmit>
                            </BigCreatTeam>
                        </Overlay>
                    </>
                    ) : <Overlay animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <BigCreatTeam><FalseWrapper>
                    <FontAwesomeIcon onClick={()=>setCreatTeam(false)} style={{position : "absolute" , top : "4%", right: "7%", zIndex : 3}} icon={faArrowAltCircleLeft} size="2x"/>
                <div style={{marginBottom : "50px", fontSize:"32px"}}>로그인 후 사용하실수 있습니다!</div>
                <Link to="/Jam/login"><Button >LogIn</Button></Link>
                </FalseWrapper></BigCreatTeam></Overlay> : null}
          </AnimatePresence>
          <NoMobile>화면이 너무 작습니다.<br></br> 
            노트북이나 컴퓨터로 접속을 권장합니다.</NoMobile>
        </Wrapper>
    );
}

export default Concert;