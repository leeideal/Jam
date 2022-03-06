import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { faArrowAltCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {useForm} from "react-hook-form"
import { getFirestore, setDoc, addDoc, collection, doc, updateDoc, where, getDocs, onSnapshot, query, orderBy } from "firebase/firestore";
import { useRecoilValue } from "recoil";
import { user } from "../atom";

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
    place: string;
    music: string;
    introduce: string;
    instarId : string;
}

const Wrapper = styled.div`
    height: 100vh;
    width: 100vw;
    margin-top: 60px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 5% 0;
`

const SessionBox = styled.div`
    margin: 5% 0;
    width: 60%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
`

const ShowTeam = styled.div`
    width: 100%;
`

const CreateTeam = styled.div`
`

const Button = styled(motion.button)`

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
    background-color: white;
    width: 50%;
    height: 80%;
    border-radius: 10px;
    position: relative;
    display: flex;
    align-items: center;
    flex-direction: column;
`

const CreatTeamTitle = styled(Title)`
    font-size: 36px;
    margin-top: 5%;
`

const CreateTeamSubmit = styled.form`

`

const CreatItem = styled.div`

`

const Tag = styled.div`

`

const Team = styled.input`

`

const TeamCheckBox = styled.input`

`

const Submit = styled.input`
    width: 60px;
`

const Teamfile = styled(motion.div)`
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

const TeamName = styled.div`

`

const TeamSession = styled.div`
    display: flex;
    div{
        margin-right: 7px;
    }
`

const Bigteam = styled(motion.div)`
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
`

const BigTag = styled.div`
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


    const onValid = async (data : IForm) => {
        console.log("hello")
        try {
            const dataObj = {
                creatorId: userObj.uid,
                createdAt: Date.now(),
                name: data.name,
                session: data.session,
                genre: data.genre,
                place: data.place,
                music: data.music,
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

            window.alert("저장되었습니다!");
        }catch(error){
            window.alert("문제가 발생했습니다. 다시시도해 주세요.")
            console.log(error);
        }
    }

    const unValid = () => {
        console.log("!!!!!!!!!");
    }

    const onFixValid = async(data : IForm) =>{
        console.log("Fix hello")
        try {
            const dataObj = {
                creatorId: userObj.uid,
                name: data.name,
                session: data.session,
                genre: data.genre,
                place: data.place,
                music: data.music,
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
        setValue("music", clickDb!.music);
        setValue("place", clickDb!.place);
        setValue("introduce", clickDb!.introduce);
        setValue("instarId", clickDb!.instarId);
    }


    return (
        <Wrapper>
            <SessionBox>
                <Title>합주 팀</Title>
                <ShowTeam>
                    {teamArray.map((prev) => <Teamfile key={prev.createdAt} onClick={() => TeamClick(prev)}>
                    <TeamName>{prev.name}</TeamName>
                    <TeamSession>
                        <div>모집 세션 : </div>
                        {prev.session.map((prev:string) => <div>{prev}</div>)}
                    </TeamSession>
                </Teamfile>)}
                </ShowTeam>
                <CreateTeam>
                    <Button onClick={()=>setCreatTeam(true)} layoutId={"creatbtn"}>{creatTeam ? null: "Jam 만들기"}</Button>
                </CreateTeam>
            </SessionBox>
            <AnimatePresence>
            {clickBox ? (
            // Team 정보 창
              <>
                <Overlay animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <Bigteam >
                    <FontAwesomeIcon onClick={()=> setClickBox(false)} style={{position : "absolute" , top : 30, right: 30}} icon={faArrowAltCircleLeft} size="2x"/>
                        {clickBox ? fixTeam ? 
                        // Team 정보 수정화면
                        <>
                            <CreatTeamTitle>Jam 수정하기</CreatTeamTitle>
                                <CreateTeamSubmit onSubmit={handleSubmit(onFixValid, unValid)}>
                                    <CreatItem>
                                        <Tag>팀명 :</Tag>
                                        <Team {...register("name", {required : true,})} type="text" maxLength={10}/>
                                    </CreatItem>
                                    <CreatItem>
                                        <Tag>음악장르 :</Tag>
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
                                        <Tag>필요세션 :</Tag>
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
                                        <Tag>합주할 곡 :</Tag>
                                        <Team {...register("music", {required : true,})} type="text"/>
                                    </CreatItem>
                                    <CreatItem>
                                        <Tag>합주 장소 :</Tag>
                                        <Team {...register("place", {required : true,})} type="text"/>
                                    </CreatItem>
                                    <CreatItem>
                                        <Tag>팀 소개 :</Tag>
                                        <Team {...register("introduce", {required : true,})} type="text" maxLength={30} style={{width:"50%"}}/>
                                    </CreatItem>
                                    <CreatItem>
                                        <Tag>팀장 인스타그램 아이디 :</Tag>
                                        <Team {...register("instarId", {required : true,})} type="text" />
                                    </CreatItem>
                                    <Submit type = "submit" value="저장하기"/>
                                </CreateTeamSubmit>
                        </> 
                        
                        // Team 정보 화면
                        : <><BigHeadItem>
                            {clickDb?.name}
                        </BigHeadItem>
                        <BigItem>
                            <BigTag>장르 : </BigTag>
                            {clickDb?.genre.map((prev:string) => <span>{prev} </span>)}
                        </BigItem>
                        <BigItem>
                            <BigTag>합주 곡 : </BigTag>
                            {clickDb?.music}
                        </BigItem>
                        <BigItem>
                            <BigTag>필요 세션 : </BigTag>
                            {clickDb?.session.map((prev:string) => <span>{prev} </span>)}
                        </BigItem>
                        <BigItem>
                            <BigTag>합주 장소 : </BigTag>
                            {clickDb?.place}
                        </BigItem>
                        <BigItem>
                            <BigTag>팀 소개 : </BigTag>
                            {clickDb?.introduce}
                        </BigItem>
                        <BigItem>
                            <BigTag>팀 Contact</BigTag>
                            {clickDb?.instarId}
                        </BigItem>
                        {clickDb?.creatorId === localStorage.getItem("uid") ? <button onClick={clickFix}>수정하기</button> : null}
                        </> : null}
                    </Bigteam>
                </Overlay>
              </>
            ) : null}
          </AnimatePresence>
            <AnimatePresence>
                    {creatTeam ? (
                    <>
                        <Overlay animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <BigCreatTeam layoutId={"creatbtn"}>
                                <FontAwesomeIcon onClick={()=>setCreatTeam(false)} style={{position : "absolute" , top : 30, right: 30}} icon={faArrowAltCircleLeft} size="2x"/>
                                <CreatTeamTitle>Jam 만들기</CreatTeamTitle>
                                <CreateTeamSubmit onSubmit={handleSubmit(onValid, unValid)}>
                                    <CreatItem>
                                        <Tag>팀명 :</Tag>
                                        <Team {...register("name", {required : true,})} type="text" maxLength={10} placeholder="최대 10자"/>
                                    </CreatItem>
                                    <CreatItem>
                                        <Tag>음악장르 :</Tag>
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
                                        <Tag>필요세션 :</Tag>
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
                                        <Tag>합주할 곡 :</Tag>
                                        <Team {...register("music", {required : true,})} type="text"  placeholder="예) 아이유 - 삐삐"/>
                                    </CreatItem>
                                    <CreatItem>
                                        <Tag>합주 장소 :</Tag>
                                        <Team {...register("place", {required : true,})} type="text" placeholder="예) 서울 중구, 서울 종로구"/>
                                    </CreatItem>
                                    <CreatItem>
                                        <Tag>팀 소개 :</Tag>
                                        <Team {...register("introduce", {required : true,})} type="text" maxLength={30} style={{width:"50%"}} placeholder="최대 30자"/>
                                    </CreatItem>
                                    <CreatItem>
                                        <Tag>팀장 인스타그램 아이디 :</Tag>
                                        <Team {...register("instarId", {required : true,})} type="text" placeholder="lee_sang1124"/>
                                    </CreatItem>
                                    <Submit type = "submit" value="저장하기"/>
                                </CreateTeamSubmit>
                            </BigCreatTeam>
                        </Overlay>
                    </>
                    ) : null}
          </AnimatePresence>
        </Wrapper>
    );
}

export default Concert;