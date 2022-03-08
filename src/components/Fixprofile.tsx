import {useForm} from "react-hook-form"
import styled from "styled-components";
import { getFirestore, setDoc, collection, doc, query, where, getDocs } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadString } from "firebase/storage";
import { useEffect, useRef, useState } from "react";
import {v4} from "uuid";
import { useRecoilValue } from "recoil";
import { user } from "../atom";


interface IForm {
    name: string;
    poto: any;
    instrument: any;
    genre: any;
    artist: string;
    music: string;
    introduce: string;
    instarId: string;
}

const Wapper = styled.form`
    width: 60%;
    height: 100%;
    display: flex;
    flex-direction: column;
`

const Item = styled.div`

`

const Items = styled.div`

`

const Tag = styled.div`

`

const Name = styled.input`

`

const Poto = styled.input`

`
const Prepoto = styled.img`
    width : 200px;
    height: 200px;
    border-radius: 200px;
`

const Instrument = styled.input`

`

const Genre = styled.input`

`

const Singer = styled.input`

`

const Music = styled.input`
`

const Introduce = styled.input`

`

const Instar = styled.input`

`

const Submit = styled.input`
    width: 60px;
`

const Unp = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`

const UnpBtn = styled.button`

`

const Showprofile = styled.div`
     width: 60%;
    height: 100%;
    display: flex;
    flex-direction: column;
`

const FixPoto = styled.div`
 cursor: pointer;
`



function Logprofile() {
    const {register,  handleSubmit, setValue} = useForm<IForm>();
    const dbService = getFirestore();
    const storageService = getStorage();
    const userObj = useRecoilValue(user);
    const [fixProfile, setFixProfile] = useState(true);

    const [pname, setPname] = useState("");
    const [ppoto, setPpoto] = useState("") as any;
    const [pinstrument, setPinstrument] = useState([]);
    const [pgenre, setPgenre] = useState([]);
    const [partist, setPatrist] = useState("");
    const [pmusic, setPmusic] = useState("");
    const [pintroduce, setPintroduce] = useState("");
    const [pinstar, setPinstar] = useState("");

    const potoRef = useRef<HTMLInputElement>(null);

    const [clickDisplay, setClickDisplay] = useState(true);

    const [attachment, setAttachment] = useState(ppoto);

    const [clickPoto, setClickPoto] = useState(0);



    

    const onFileChange = (event: React.FormEvent<HTMLInputElement>) => {
    const {currentTarget : {files}} = event;    
    const theFile = files![0];          
    const reader = new FileReader();   

    reader.onloadend = (finishedEvent : any) => { 
        const{ currentTarget : {result}} = finishedEvent;
        setAttachment(result);
    }
    reader.readAsDataURL(theFile);              
    }

    const onClearPhoto = () => {
        setAttachment("https://t1.daumcdn.net/cfile/tistory/2513B53E55DB206927");
    }

    const onValid = async (data : IForm) => {
        console.log("hello");
        try {
            const fileRef = ref(storageService, `${userObj.uid}/${v4()}`);
            const response = await uploadString(fileRef, attachment);
            await getDownloadURL(response.ref);

            const dataObj = {
                creatorId: userObj.uid,
                createdAt: Date.now(),
                name: data.name,
                poto : attachment ? attachment : "https://t1.daumcdn.net/cfile/tistory/2513B53E55DB206927",
                instrument: data.instrument,
                genre: data.genre,
                artist: data.artist.split(","),
                music: data.music.split(","),
                introduce: data.introduce,
                instarId : data.instarId
            }

            await setDoc(doc(collection(dbService, "profiles"), `${userObj.uid}`), dataObj);

            window.alert("저장되었습니다!");

            setFixProfile(true);

            setClickDisplay(prev => !prev);

        }catch(error){
            window.alert("문제가 발생했습니다. 다시시도해 주세요.")
            console.log(error);
        }
    }

    const unValid = () => {
        console.log("!!!!!!!!!");
    }



    const getUserProfile = async() => {
        const localUid = localStorage.getItem("uid");
        const dbProfile = query(collection(dbService, "profiles"), where("creatorId", "==", `${localUid}`));
        const querySnapshot = await getDocs(dbProfile);
        querySnapshot.forEach((doc) => {
            setPname(doc.data().name);
            setPpoto(doc.data().poto);
            setPinstrument(doc.data().instrument);
            setPgenre(doc.data().genre);
            setPatrist(doc.data().artist.join(","));
            setPmusic(doc.data().music.join(","));
            setPintroduce(doc.data().introduce);
            setPinstar(doc.data().instarId);
            console.log("querySnapshot.forEach한 결과 : ", doc.id, " => ", doc.data())
        });
    }

    useEffect(() => {
        setFixProfile(true);
        getUserProfile();
    },[clickDisplay]);


    const clickfix = () => {
        setFixProfile(false)
        setValue("name", pname);
        setValue("genre", pgenre);
        setValue("instrument", pinstrument);
        setValue("artist", partist);
        setValue("music", pmusic);
        setValue("introduce", pintroduce);
        setValue("poto", ppoto);
        setValue("instarId", pinstar);
        setAttachment(ppoto)
    }

    return(
        <>
            {fixProfile ? 
            // 프로파일 화면
            <Showprofile>
                <Item style={{display: "flex", justifyContent :"space-between"}}>
                <Items>
                    <Tag>활동명 : </Tag>
                    <div>{pname ? pname : "이름을 설정해주세요"}</div>
                </Items>
                <Items>
                    <Tag>프로필 사진 : </Tag>
                        <Prepoto src={ppoto ? ppoto : "https://t1.daumcdn.net/cfile/tistory/2513B53E55DB206927"}/>
                </Items>
                </Item>
                <Item>
                    <Tag>희망 세션 : </Tag>
                    {pinstrument ? pinstrument.map(prev => <span key={prev}> {prev} </span>) : "원하는 악기를 설정해주세요"}
                </Item>
                <Item>
                    <Tag>좋아하는 음악장르</Tag>
                    {pgenre ? pgenre.map(prev => <span key={prev}> {prev} </span>) : "원하는 악기를 설정해주세요"}
                </Item>
                <Item>
                    <Tag>좋아하는 아티스트</Tag>
                    <div>{partist ? partist : "좋아하는 아티스트를 설정해주세요"}</div>
                </Item>
                <Item>
                    <Tag>하고싶은 곡</Tag>
                    <div>{pmusic ? pmusic : "연주하고 싶은 곡을 설정해주세요"}</div>
                </Item>
                <Item>
                    <Tag>간단한 자기소개</Tag>
                    <div>{pintroduce ? pintroduce : "자신을 소개해주세요!"}</div>
                </Item>
                <Item>
                    <Tag>인스타그램 아이디</Tag>
                    <div>{pinstar ? pinstar : "아이디를 입력해주세요"}</div>
                </Item>
                <Submit onClick={clickfix} type = "submit" value="수정하기"/>
            </Showprofile>
            : 
            // 프로파일 수정화면
            <Wapper onSubmit={handleSubmit(onValid, unValid)}>
            <Item style={{display: "flex", justifyContent :"space-between"}}>
                <Items>
                    <Tag>활동명 : </Tag>
                    <Name {...register("name", {required : true,})} type="text" placeholder="Ex) 제제"/>
                </Items>
                <Items>
                    <Tag>프로필 사진 : </Tag>
                    <Poto {...register("poto")} onClick = {() => setClickPoto(prev => prev+1)} ref={potoRef} accept="image/*" onChange={onFileChange} type="file"/>
                    <div>
                        <Prepoto src={clickPoto === 0 ? ppoto ? ppoto : "https://t1.daumcdn.net/cfile/tistory/2513B53E55DB206927" :  attachment}/>
                        <FixPoto onClick={onClearPhoto}>기본으로 설정</FixPoto>
                    </div>
                </Items>
            </Item>
            <Item>
                <Tag>희망 세션 : </Tag>
                <Instrument {...register("instrument", {required : true,})} type="checkbox" value="보컬"/>
                <label htmlFor="보컬">보컬</label>
                <Instrument {...register("instrument", {required : true,})} type="checkbox" value="통기타" />
                <label htmlFor="통기타">통기타</label>
                <Instrument {...register("instrument", {required : true,})} type="checkbox" value="일렉기타" />
                <label htmlFor="일렉기타">일렉기타</label>
                <Instrument {...register("instrument", {required : true,})} type="checkbox" value="베이스" />
                <label htmlFor="베이스">베이스</label>
                <Instrument {...register("instrument", {required : true,})} type="checkbox" value="키보드" />
                <label htmlFor="키보드">키보드</label>
                <Instrument {...register("instrument", {required : true,})} type="checkbox" value="신디사이저" />
                <label htmlFor="신디사이저">신디사이저</label>
                <Instrument {...register("instrument", {required : true,})} type="checkbox" value="드럼" />
                <label htmlFor="드럼">드럼</label>
            </Item>
            <Item>
                <Tag>좋아하는 음악장르</Tag>
                <Genre {...register("genre", {required : true,})} type="checkbox" value="발라드"/>
                <label htmlFor="발라드">발라드</label>
                <Genre {...register("genre", {required : true,})} type="checkbox" value="POP" />
                <label htmlFor="POP">POP</label>
                <Genre {...register("genre", {required : true,})} type="checkbox" value="K-POP" />
                <label htmlFor="K-POP">K-POP</label>
                <Genre {...register("genre", {required : true,})} type="checkbox" value="랩/힙합" />
                <label htmlFor="랩/힙합">랩/힙합</label>
                <Genre {...register("genre", {required : true,})} type="checkbox" value="RnB/Soul" />
                <label htmlFor="RnB/Soul">RnB/Soul</label>
                <Genre {...register("genre", {required : true,})} type="checkbox" value="인디음악" />
                <label htmlFor="인디음악">인디음악</label>
                <Genre {...register("genre", {required : true,})} type="checkbox" value="록/메탈" />
                <label htmlFor="록/메탈">록/메탈</label>
                <Genre {...register("genre", {required : true,})} type="checkbox" value="포크/블루스" />
                <label htmlFor="포크/블루스">포크/블루스</label>
            </Item>
            <Item>
                <Tag>좋아하는 아티스트</Tag>
                <Singer {...register("artist", {required : true,})} type="text" placeholder="Ex) 아이유, 백현"/>
            </Item>
            <Item>
                <Tag>하고싶은 곡</Tag>
                <Music {...register("music", {required : true,})} type="text" placeholder="Ex) 아이유-삐삐, 백예린-Square"/>
            </Item>
            <Item>
                <Tag>간단한 자기소개</Tag>
                <Introduce {...register("introduce", {required : true,})} type="text" style={{width:"50%"}} placeholder="30자 이내" maxLength={30}/>
            </Item>
            <Item>
                <Tag>인스타그램 아이디</Tag>
                <Instar {...register("instarId", {required : true,})} type="text" placeholder="Ex) leeideal"/>
            </Item>
            <Submit type = "submit" value="저장하기"/>
        </Wapper> 
        }
        </>
    );
}

export default Logprofile;