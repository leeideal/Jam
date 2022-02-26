import { AnimatePresence, motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useMatch} from "react-router-dom";
import styled from "styled-components";
import { faArrowAltCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { useState } from "react";


const LoginOverlay = styled(motion.div)`
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    opacity: 0;
    display: flex;
    justify-content: center;
    align-items: center;
`

const LoginBox = styled(motion.div)`
    background-color: white;
    width: 60vw;
    height: 80vh;
    border-radius: 10px;
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 20%;
`

const Title = styled.div`
    
`

const IdLogIn = styled.input`

`

const PassLogIn = styled(IdLogIn)`

`


const Welcome = styled.input`

`


function Auth() {
    const loginMatch = useMatch("/auth");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const auth = getAuth();
    const navigate = useNavigate();

    const onChange = (event: React.FormEvent<HTMLInputElement>) => {
        const {currentTarget : { value, name },} = event;
        if(name === "email"){
            setEmail(value);
        }else if(name === "password"){
            setPassword(value);
        }
    }

    const onSubmit = async(event:React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // 회원가입 + 로그인 기능
        try {
                await createUserWithEmailAndPassword(auth, email, password);
                navigate("/");
            }catch (err){
                window.alert("문제가 발생하였습니다. 다시확인해주시기 바랍니다.");
        }
    }

    return (
        <AnimatePresence>
            {loginMatch ? (
                    <LoginOverlay animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <LoginBox>
                            <Link to="/login">
                                <FontAwesomeIcon style={{position : "absolute" , top : 30, right: 30}} icon={faArrowAltCircleLeft} size="2x"/>
                            </Link>
                            <Title>JAM - Sign Up</Title>
                            <form onSubmit={onSubmit}>
                                <IdLogIn onChange={onChange} name="email" type="text" placeholder="Email" required value={email}/>
                                <PassLogIn onChange={onChange} name="password" type="password" placeholder="Password" required value={password}/>
                                <Welcome type="submit" value={"Sign Up"}/>
                            </form>
                        </LoginBox>
                    </LoginOverlay>
                ) : null}
        </AnimatePresence>
    );
}

export default Auth;