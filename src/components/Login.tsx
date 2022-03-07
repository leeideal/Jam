import { AnimatePresence, motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useMatch} from "react-router-dom";
import styled from "styled-components";
import { faArrowAltCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {getAuth,signInWithEmailAndPassword,GoogleAuthProvider,signInWithPopup,FacebookAuthProvider} from 'firebase/auth';
import { useState } from "react";
import { faFacebook, faGoogle } from "@fortawesome/free-brands-svg-icons";


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
    @media screen and (max-width: 500px) {
        padding: 5%;
        padding-top:100px;
        width: 80vw;
    }
    @media screen and (min-width: 500px) and (max-width: 1250px) {
        padding: 0% 10% 5% 10%;
        padding-top:100px ;
        width: 80vw;
    }
    background-color: white;
    width: 60vw;
    height: 80vh;
    border-radius: 10px;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 5% 15% 10%;
`

const Title = styled.div`
    font-size: 38px;
    margin-bottom: 50px;
`

const IdLogIn = styled.input`
    border-top : none;
    border-left : none;
    border-right : none;
    height: 50px ;
    color: rgba(0,0,0,0.9);
    font-size: 18px;
    &:hover{
        border-bottom : 1px solid rgba(0,0,0,0.9);
        transition: 0.4s ease-in-out;
        color: rgba(0,0,0,0.9);
    }
    &:hover::placeholder{
        color : rgba(0,0,0,0.9);
        transition: 0.4s ease-in-out;
    }
    &:not(:hover){
        transition: 0.4s ease-in-out;
        border-bottom : 1px solid rgba(0,0,0,0.25);
    }
    &:not(:hover)::placeholder{
        color: rgba(0,0,0,0.25);
        transition: 0.4s ease-in-out;
    }
    &:focus{
        border-bottom : 1px solid rgba(0,0,0,0.9);
        color: rgba(0,0,0,0.9);
    }
    margin-bottom: 20px;
`

const PassLogIn = styled(IdLogIn)`
    margin-bottom: 40px;
`

const LogButton = styled.input`
    height: 54px;
    border: none;
    border-radius: 7px;
    background-color: #444444;
    color: white;
    margin-bottom:10px;
    cursor:pointer;
    &:hover{
        transition: 0.4s ease-in-out;
        background-color: white;
        border : 1px solid  #444444;
        color: #444444;
    }
    &:hover::placeholder{
        transition: 0.4s ease-in-out;
        background-color: #444444;
        color: white;
    }
`

const GoogleLog = styled.button`
    @media screen and (max-width: 630px) {
        svg{
            display:  none;
        }
    }
    cursor:pointer;
    display: flex;
    align-items: center;
    justify-content:center ;
    height: 54px;
    border: none;
    border-radius: 7px;
    margin-bottom: 10px;
    background-color: #bdbdbd;
    color: white;
    font-size: 18px;
    &:hover{
        transition: 0.4s ease-in-out;
        background-color: white;
        border : 1px solid   #bdbdbd;
        color:  #bdbdbd;
    }
    &:not(:hover){
        transition: 0.4s ease-in-out;
        background-color: #bdbdbd;
        color: white;
    }
    position: relative;
    svg{
        position: absolute;
        left: 0;
        margin-left: 60px ;
    }
    
`

const FaceBookLogIn = styled.button`
    @media screen and (max-width: 630px) {
        svg{
            display:  none;
        }
    }
    cursor:pointer;
    display: flex;
    align-items: center;
    justify-content:center ;
    height: 54px;
    border: none;
    border-radius: 7px;
    background-color: #333333;
    color: white;
    font-size: 18px;
    &:hover{
        transition: 0.4s ease-in-out;
        background-color: white;
        border : 1px solid   #3d548e;
        color:  #3d548e;
    }
    &:not(:hover){
        transition: 0.4s ease-in-out;
        background-color: #3d548e;
        color: white;
    }
    position: relative;
    svg{
        position: absolute;
        left: 0;
        margin-left: 58px;
    }
`

const Welcome = styled.button`
    font-size: 18px;
    height: 54px;
    border: none;
    border-radius: 7px;
    background-color: #444444;
    color: white;
    cursor:pointer;
    &:hover{
        transition: 0.4s ease-in-out;
        background-color: white;
        border : 1px solid  #444444;
        color: #444444;
    }
    &:hover::placeholder{
        transition: 0.4s ease-in-out;
        background-color: #444444;
        color: white;
    }
    margin-bottom: 40px;
`

const LoginForm = styled.form`
    display:flex;
    flex-direction: column;
`

const Bar = styled.div`
    background-color: #444444;
    height: 1px;
    border-radius: 10px;
    margin-bottom: 40px;
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
                            <Title>LOGIN</Title>
                            <LoginForm onSubmit={onSubmit}>
                                <IdLogIn onChange={onChange} value={email} name="email" type="text" placeholder="Email" required />
                                <PassLogIn onChange={onChange} value={password} name="password" type="password" placeholder="Password" required />
                                <LogButton type="submit" value={"Log In"} style={{fontSize:"18px"}}/>
                                <Welcome onClick={() => navigate("/auth")}>Sign Up</Welcome>
                            </LoginForm>
                                <Bar></Bar>
                                <GoogleLog onClick={onSocialClick} name="google"> <FontAwesomeIcon icon={faGoogle} size="2x"/> <div>Sing in with Google</div>  </GoogleLog>
                                <FaceBookLogIn onClick={onSocialClick} name="facebook"> <FontAwesomeIcon icon={faFacebook} size="2x"/><div>Sing in with FaceBook</div> </FaceBookLogIn>
                        </LoginBox>
                    </LoginOverlay>
                ) : null}
        </AnimatePresence>
    );
}

export default Login;