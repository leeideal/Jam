import {useForm} from "react-hook-form"
import styled from "styled-components";
import { getFirestore, setDoc, collection, doc, query, where, getDocs } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadString } from "firebase/storage";
import { useEffect, useRef, useState } from "react";
import {v4} from "uuid";
import { useRecoilState, useRecoilValue } from "recoil";
import { firstProfile, profilecheck, user } from "../atom";


interface IForm {
    name: string;
    instrument: string;
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



function Logprofile() {
    const {register,  handleSubmit} = useForm<IForm>();
    const dbService = getFirestore();
    const [attachment, setAttachment] = useState("https://t1.daumcdn.net/cfile/tistory/2513B53E55DB206927");
    const potoRef = useRef<HTMLInputElement>(null);
    const storageService = getStorage();
    const userObj = useRecoilValue(user);
    const [isFirstProfile, setIsFirstProfile] = useRecoilState(firstProfile);
    const isProfile = useRecoilValue(profilecheck);
    const [fixProfile, setFixProfile] = useState(true);


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
        potoRef.current!.value = "";

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

        }catch(error){
            window.alert("문제가 발생했습니다. 다시시도해 주세요.")
            console.log(error);
        }
        potoRef.current!.value = ""
    }

    const unValid = () => {
        console.log("!!!!!!!!!");
    }


    const getUserProfile = async() => {
        const dbProfile = query(collection(dbService, "profiles"), where("creatorId", "==", userObj.uid));
        const querySnapshot = await getDocs(dbProfile);
        querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data().artist)
        });
    }

    let profileName = "";
    let profilePoto = "";
    let profileInstrument = "";
    let profileGenre = "";
    let profileArtist = "";
    let profileMusic = "";
    let profileIntroduce = "";

    useEffect(() => {
        getUserProfile();
        setFixProfile(true);
    },[]);



    return(
        <>
            {isProfile ? fixProfile ? 
            // 프로파일 화면
            <Showprofile>
                <Item style={{display: "flex", justifyContent :"space-between"}}>
                <Items>
                    <Tag>닉네임 : </Tag>
                    <div>{profileName}</div>
                </Items>
                <Items>
                    <Tag>프로필 사진 : </Tag>
                    <Poto accept="image/*" ref={potoRef} onChange={onFileChange} type="file"/>
                    {attachment && (
                        <div>
                            <Prepoto src={attachment}/>
                            {attachment !== "https://t1.daumcdn.net/cfile/tistory/2513B53E55DB206927" ? <button onClick={onClearPhoto}>Cancel</button> : null }
                        </div>
                    )}
                </Items>
                </Item>
                <Item>
                    <Tag>희망 세션 : </Tag>
                    <Instrument {...register("instrument", {required : true,})} type="text"/>
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
                <Submit type = "submit" value="수정하기"/>
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
                    <Poto accept="image/*" ref={potoRef} onChange={onFileChange} type="file"/>
                    {attachment && (
                        <div>
                            <Prepoto src={attachment}/>
                            {attachment !== "https://t1.daumcdn.net/cfile/tistory/2513B53E55DB206927" ? <button onClick={onClearPhoto}>Cancel</button> : null }
                        </div>
                    )}
                </Items>
            </Item>
            <Item>
                <Tag>희망 세션 : </Tag>
                <Instrument {...register("instrument", {required : true,})} type="text"/>
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
            <Submit type = "submit" value="수정완료"/>
        </Wapper> 

        : 
        // 첫 프로파일인지 확인
        isFirstProfile ? 

        // 첫 프로파일 설정 시작화면
        <Unp><UnpBtn onClick={() => setIsFirstProfile(false)}>첫 프로필 만들러 가기</UnpBtn></Unp> 
        
        : 
        // 첫 프로파일 설정화면
        <Wapper onSubmit={handleSubmit(onValid, unValid)}>
            <Item style={{display: "flex", justifyContent :"space-between"}}>
                <Items>
                    <Tag>닉네임 : </Tag>
                    <Name {...register("name", {required : true,})} type="text"/>
                </Items>
                <Items>
                    <Tag>프로필 사진 : </Tag>
                    <Poto accept="image/*" ref={potoRef} onChange={onFileChange} type="file"/>
                    {attachment && (
                        <div>
                            <Prepoto src={attachment}/>
                            {attachment !== "https://t1.daumcdn.net/cfile/tistory/2513B53E55DB206927" ? <button onClick={onClearPhoto}>Cancel</button> : null }
                        </div>
                    )}
                </Items>
            </Item>
            <Item>
                <Tag>희망 세션 : </Tag>
                <Instrument {...register("instrument", {required : true,})} type="text"/>
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
            <Submit type = "submit" value="저장"/>
        </Wapper>}
        </>
    );
}

export default Logprofile;