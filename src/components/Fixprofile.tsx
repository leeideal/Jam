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
    margin-top: 70px ;
    width: 90%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center ;
`

const Item = styled.div`
    height: 85px;
`

const ItemG = styled.div`
    @media screen and (max-width: 600px) {
        height: 105px;
    }
    height: 85px;
`

const Tag = styled.div`
    margin-bottom: 2% ;
    font-size: 16px ;
    color: rgba(0,0,0,0.4);
`

const Name = styled.input`

`

const Poto = styled.input`
    display: none ;
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
    margin-top: 50px;
    width: 100px;
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
`

const Showprofile = styled.div`
    margin-top: 70px ;
    width: 90%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center ;
`

const FixPoto = styled.div`
    margin-left: 20px ;
    cursor: pointer;
    display: flex ;
    justify-content: center;
    align-items: center ;
    width: 70px;
    padding: 3px;
    border: none;
    border-radius: 7px;
    background-color: #dfe6e9;
    color: black;
    font-size: 16px;
    &:hover{
    transition: 0.4s ease-in-out;
    background-color: white;
    border : 1px solid   #dfe6e9;
    color:  rgba(0,0,0,0.5);
    }
    &:not(:hover){
        transition: 0.4s ease-in-out;
        background-color: #dfe6e9;
        color: black;
    }
`

const ProfilePoto= styled.div`
    display:flex ;
    flex-direction: column ;
    align-items:center ;

`

const ProfileBasic = styled.div`
    margin-top: 70px;
    width: 100%;
    display: flex;
    justify-content: space-around ;
`

const ProfileBasicInfo = styled.div`
    margin-right: 10px;
`

const ProfileMusicInfo = styled.div`
    margin-left: 10px;
`

const PotoBtn = styled.div`
    margin-top: 10px ;
    display: flex;
    align-items: center ;
`

const PotoLabel = styled.label`
    margin-right: 20px ;
    cursor: pointer;
    display: flex ;
    justify-content: center;
    align-items: center ;
    width: 70px;
    padding: 3px;
    border: none;
    border-radius: 7px;
    background-color: #dfe6e9;
    color: black;
    font-size: 16px;
    &:hover{
    transition: 0.4s ease-in-out;
    background-color: white;
    border : 1px solid   #dfe6e9;
    color:  rgba(0,0,0,0.5);
    }
    &:not(:hover){
        transition: 0.4s ease-in-out;
        background-color: #dfe6e9;
        color: black;
    }
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
        const check = (str:string) => {
            if (str.split(',').length - 1 === 1){
                var patt1 =  /[???-???|???-???|a-z|A-Z|0-9|]+[ ]*[-]+[ ]*[???-???|???-???|a-z|A-Z|0-9|]+[ ]*[,]+[ ]*[???-???|???-???|a-z|A-Z|0-9|]+[ ]*[-]+[ ]*[???-???|???-???|a-z|A-Z|0-9|]+/g;
                const result1 = patt1.test(str);
                return result1;
            }else if(str.split(',').length - 1 > 1){
                window.alert("????????? ????????? ??????????????????.")
            }else if(str.includes(",") === false){
                var patt =  /^[???-???|???-???|a-z|A-Z|0-9|]+[ ]*[-]+[ ]*[???-???|???-???|a-z|A-Z|0-9|]+$/g;
                const result = patt.test(str);
                return result
            }
        }
        const checkResult = check(data.music);
        if (checkResult === false){
            window.alert("??????????????? ?????? ??????????????????.");
            return null
        }
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

            window.alert("?????????????????????!");

            setFixProfile(true);

            setClickDisplay(prev => !prev);

        }catch(error){
            window.alert("????????? ??????????????????. ??????????????? ?????????.")
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
            console.log("querySnapshot.forEach??? ?????? : ", doc.id, " => ", doc.data())
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
            // ???????????? ??????
            <Showprofile>
                <ProfilePoto>
                        <Prepoto src={ppoto ? ppoto : "https://t1.daumcdn.net/cfile/tistory/2513B53E55DB206927"}/>
                </ProfilePoto>
                <ProfileBasic>
                    <ProfileBasicInfo>
                        <Item>
                            <Tag>Name </Tag>
                            <div>{pname ? pname : null}</div>
                        </Item>
                        <Item>
                            <Tag>Instargram ID</Tag>
                            <div>{pinstar ? pinstar : null}</div>
                        </Item>
                        <Item>
                            <Tag>Introduction</Tag>
                            <div>{pintroduce ? pintroduce : null}</div>
                        </Item>
                    </ProfileBasicInfo>
                    <ProfileMusicInfo>
                        <Item>
                            <Tag>Session </Tag>
                            {pinstrument ? pinstrument.map(prev => <span key={prev}> {prev} </span>) : null}
                        </Item>
                        <Item>
                            <Tag>Favorite Genre</Tag>
                            {pgenre ? pgenre.map(prev => <span key={prev}> {prev} </span>) : null}
                        </Item>
                        <Item>
                            <Tag>Favorite Artist</Tag>
                            <div>{partist ? partist : null}</div>
                        </Item>
                        <Item>
                            <Tag>A Music Want To Play</Tag>
                            <div>{pmusic ? pmusic : null}</div>
                        </Item>
                    </ProfileMusicInfo>
                </ProfileBasic>
                <Submit onClick={clickfix} type = "submit" value="????????????"/>
            </Showprofile>
            : 
            // ???????????? ????????????
            <Wapper onSubmit={handleSubmit(onValid, unValid)}>
            <ProfilePoto>
                <Poto {...register("poto")} onClick = {() => setClickPoto(prev => prev+1)} ref={potoRef} accept="image/*" onChange={onFileChange} type="file" id="p"/>
                <Prepoto src={clickPoto === 0 ? ppoto ? ppoto : "https://t1.daumcdn.net/cfile/tistory/2513B53E55DB206927" :  attachment}/>
                <PotoBtn>
                    <PotoLabel htmlFor="p">?????????</PotoLabel>
                    <FixPoto onClick={onClearPhoto}>??????</FixPoto>
                </PotoBtn>
            </ProfilePoto>
            <ProfileBasic>
                <ProfileBasicInfo>
                    <Item>
                        <Tag>Name</Tag>
                        <Name {...register("name", {required : true,})} type="text" placeholder="Ex) ?????????"/>
                    </Item>
                    <Item>
                    <Item>
                        <Tag>Instargram ID</Tag>
                        <Instar {...register("instarId", {required : true,})} type="text" placeholder="Ex) leeideal"/>
                    </Item>
                    <Tag>Introduction</Tag>
                        <Introduce {...register("introduce", {required : true,})} type="text" placeholder="20??? ??????" maxLength={20}/>
                    </Item>
                </ProfileBasicInfo>
                    <ProfileMusicInfo>
                        <Item>
                            <Tag>Session (?????? 3???) </Tag>
                            <Instrument {...register("instrument", {required : true,})} type="checkbox" value="??????"/>
                            <label htmlFor="??????">??????</label>
                            <Instrument {...register("instrument", {required : true,})} type="checkbox" value="?????????" />
                            <label htmlFor="?????????">?????????</label>
                            <Instrument {...register("instrument", {required : true,})} type="checkbox" value="????????????" />
                            <label htmlFor="????????????">????????????</label>
                            <Instrument {...register("instrument", {required : true,})} type="checkbox" value="?????????" />
                            <label htmlFor="?????????">?????????</label>
                            <Instrument {...register("instrument", {required : true,})} type="checkbox" value="?????????" />
                            <label htmlFor="?????????">?????????</label>
                            <Instrument {...register("instrument", {required : true,})} type="checkbox" value="???????????????" />
                            <label htmlFor="???????????????">???????????????</label>
                            <Instrument {...register("instrument", {required : true,})} type="checkbox" value="??????" />
                            <label htmlFor="??????">??????</label>
                        </Item>
                        <ItemG>
                            <Tag>Favorite Genre</Tag>
                            <Genre {...register("genre", {required : true,})} type="checkbox" value="?????????"/>
                            <label htmlFor="?????????">?????????</label>
                            <Genre {...register("genre", {required : true,})} type="checkbox" value="POP" />
                            <label htmlFor="POP">POP</label>
                            <Genre {...register("genre", {required : true,})} type="checkbox" value="K-POP" />
                            <label htmlFor="K-POP">K-POP</label>
                            <Genre {...register("genre", {required : true,})} type="checkbox" value="???/??????" />
                            <label htmlFor="???/??????">???/??????</label>
                            <Genre {...register("genre", {required : true,})} type="checkbox" value="RnB/Soul" />
                            <label htmlFor="RnB/Soul">RnB/Soul</label>
                            <Genre {...register("genre", {required : true,})} type="checkbox" value="????????????" />
                            <label htmlFor="????????????">????????????</label>
                            <Genre {...register("genre", {required : true,})} type="checkbox" value="???/??????" />
                            <label htmlFor="???/??????">???/??????</label>
                            <Genre {...register("genre", {required : true,})} type="checkbox" value="??????/?????????" />
                            <label htmlFor="??????/?????????">??????/?????????</label>
                        </ItemG>
                        <Item>
                            <Tag>Favorite Artist</Tag>
                            <Singer {...register("artist", {required : true,})} type="text" placeholder="Ex) ?????????, ??????"/>
                        </Item>
                        <Item>
                            <Tag>A Music Want To Play
                                ("?????? - ??????, ... "??? ?????? ?????? 2???)</Tag>
                            <Music {...register("music", {required : true,})} type="text" placeholder="Ex) ?????????-??????, ?????????-Square"/>
                        </Item>
                </ProfileMusicInfo>
            </ProfileBasic>
            <Submit type = "submit" value="????????????"/>
        </Wapper> 
        }
        </>
    );
}

export default Logprofile;