import { AnimatePresence, motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useMatch} from "react-router-dom";
import styled from "styled-components";
import { faArrowAltCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {getAuth,signInWithEmailAndPassword,GoogleAuthProvider,signInWithPopup,FacebookAuthProvider} from 'firebase/auth';
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

const DefaultWapper = styled.div`

`

const LogButton = styled.input`

`

const GoogleLog = styled.button`

`

const FaceBookLogIn = styled(GoogleLog)`

`

const Welcome = styled.button`

`


function Login() {
    const loginMatch = useMatch("/login");
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
                const data = await signInWithEmailAndPassword(auth, email, password);
                console.log(data);
                navigate("/");
        }catch (err){
            window.alert("문제가 발생하였습니다. 다시확인해주시기 바랍니다.");
        }
    }

    const onSocialClick = async (event:React.MouseEvent<HTMLButtonElement>) => {
        const button: HTMLButtonElement = event.currentTarget;
        let provider;
        try{
            if(button.name === "google"){
                provider = new GoogleAuthProvider();
                await signInWithPopup(auth, provider);
                navigate("/");
            }else if(button.name === "facebook"){
                provider = new FacebookAuthProvider();
                await signInWithPopup(auth, provider);
                navigate("/");
            }
        }catch (error) {
            window.alert("문제가 발생하였습니다. 다시확인해주시기 바랍니다.");
        }
    }
    return (
        <AnimatePresence>
            {loginMatch ? (
                    <LoginOverlay animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <LoginBox>
                            <Link to="/">
                                <FontAwesomeIcon style={{position : "absolute" , top : 30, right: 30}} icon={faArrowAltCircleLeft} size="2x"/>
                            </Link>
                            <Title>JAM - Log In</Title>
                            <form onSubmit={onSubmit}>
                                <IdLogIn onChange={onChange} value={email} name="email" type="text" placeholder="Email" required />
                                <PassLogIn onChange={onChange} value={password} name="password" type="password" placeholder="Password" required />
                                <DefaultWapper>
                                    <LogButton type="submit" value={"Log In"}/>
                                    <Link to="/auth">
                                        <Welcome>Sign Up</Welcome>
                                    </Link>
                                </DefaultWapper>
                            </form>
                            <DefaultWapper>
                                <GoogleLog onClick={onSocialClick} name="google">Continue with Google  </GoogleLog>
                                <FaceBookLogIn onClick={onSocialClick} name="facebook">Continue with FaceBook </FaceBookLogIn>
                            </DefaultWapper>
                        </LoginBox>
                    </LoginOverlay>
                ) : null}
        </AnimatePresence>
    );
}

export default Login;