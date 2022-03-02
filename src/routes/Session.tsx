import styled from "styled-components";
import { getFirestore, collection, onSnapshot, query, orderBy, where } from "firebase/firestore";
import { useEffect, useState } from "react";


const Wrapper = styled.div`
    height: 90vh;
    width: 100vw;
    margin-top: 60px;
    display: flex;
    justify-content: center;
`

const SessionBox = styled.div`
    margin-top: 5%;
    width: 60%;
    height: 100%;
    display: flex;
    flex-direction: column;
`

const Profile = styled.div`
    width: 100%;
    height: 120px;
    display: flex;
    align-items: center;
    border-radius: 15px;
    box-shadow: rgba(0, 0, 0, 0.25) 0px 25px 50px -12px;
    margin-bottom: 5%;
`

const ProfilePoto = styled.img`
    width: 120px;
    height: 120px;
    border-radius: 120px;
`
const ProfileName = styled.div`

`

const ProfiletSession = styled.div`
    display: flex;
    div{
        margin-right: 7px;
    }
`

interface SnapshotData {
    artist: string;
    createdAt: number;
    creatorId: string;
    genre: string;
    id: string;
    instrument: [];
    introduce: string;
    music: string;
    name: string;
    poto: string;
}


function Session() {
    const dbService = getFirestore();
    const [profileArray, setProfileArray] = useState<SnapshotData[]>([]);


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
    

    return (
        <Wrapper>
            <SessionBox>
                {profileArray.map((prev) => <Profile key={prev.creatorId}>
                    <ProfilePoto src={prev.poto}/>
                    <ProfileName>{prev.name}</ProfileName>
                    <ProfiletSession>
                        {prev.instrument.map(prev => <div>{prev}</div>)}
                    </ProfiletSession>
                </Profile>)}
            </SessionBox>
        </Wrapper>
    );
}

export default Session;