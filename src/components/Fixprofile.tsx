import {useForm} from "react-hook-form"
import styled from "styled-components";
import { getFirestore, setDoc, collection, doc, query, where, getDocs } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadString } from "firebase/storage";
import { createRef, useEffect, useRef, useState } from "react";
import {v4} from "uuid";
import { useRecoilValue } from "recoil";
import { user } from "../atom";


interface IForm {
    name: string;
    poto: any;
    instrument: any;
    genre: string;
    artist: string;
    music: string;
    introduce: string;
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
    const [pgenre, setPgenre] = useState("");
    const [partist, setPatrist] = useState("");
    const [pmusic, setPmusic] = useState("");
    const [pintroduce, setPintroduce] = useState("");

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
        console.log("hello")
        try {
            const fileRef = ref(storageService, `${userObj.uid}/${v4()}`);
            const response = await uploadString(fileRef, attachment);
            await getDownloadURL(response.ref);

            const dataObj = {
                creatorId: userObj.uid,
                createdAt: Date.now(),
                name: data.name,
                poto : attachment,
                instrument: data.instrument,
                genre: data.genre,
                artist: data.artist,
                music: data.music,
                introduce: data.introduce
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
            setPatrist(doc.data().artist);
            setPmusic(doc.data().music);
            setPintroduce(doc.data().introduce);
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
        setAttachment(ppoto)
    }

    return(
        <>
            {fixProfile ? 
            // 프로파일 화면
            <Showprofile>
                <Item style={{display: "flex", justifyContent :"space-between"}}>
                <Items>
                    <Tag>이름 : </Tag>
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
                    <div>{pgenre ? pgenre : "좋아하는 음악장르를 설정해주세요"}</div>
                </Item>
                <Item>
                    <Tag>좋아하는 아티스트</Tag>
                    <div>{partist ? partist : "좋아하는 아티스트를 설정해주세요"}</div>
                </Item>
                <Item>
                    <Tag>하고싶은 곡</Tag>
                    <div>{pmusic ? partist : "연주하고 싶은 곡을 설정해주세요"}</div>
                </Item>
                <Item>
                    <Tag>간단한 자기소개</Tag>
                    <div>{pintroduce ? pintroduce : "자신을 소개해주세요!"}</div>
                </Item>
                <Submit onClick={clickfix} type = "submit" value="수정하기"/>
            </Showprofile>
            : 
            // 프로파일 수정화면
            <Wapper onSubmit={handleSubmit(onValid, unValid)}>
            <Item style={{display: "flex", justifyContent :"space-between"}}>
                <Items>
                    <Tag>닉네임 : </Tag>
                    <Name {...register("name", {required : true,})} type="text"/>
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
                <Instrument {...register("instrument", {required : true,})} type="checkbox" value="보컬" name="보컬"/>
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
                <Genre {...register("genre", {required : true,})} type="text"/>
            </Item>
            <Item>
                <Tag>좋아하는 아티스트</Tag>
                <Singer {...register("artist", {required : true,})} type="text"/>
            </Item>
            <Item>
                <Tag>하고싶은 곡</Tag>
                <Music {...register("music", {required : true,})} type="text"/>
            </Item>
            <Item>
                <Tag>간단한 자기소개</Tag>
                <Introduce {...register("introduce", {required : true,})} type="text" style={{width:"50%"}}/>
            </Item>
            <Submit type = "submit" value="저장하기"/>
        </Wapper> 
        }
        </>
    );
}

export default Logprofile;