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
    justify-content: center;
    padding: 0% 15% 10% 15%;
    @media screen and (max-width: 500px) {
        padding: 15% 5% ;
        padding-top:100px ;
        width: 80vw;
    }
    @media screen and (min-width: 500px) and (max-width: 1250px) {
        padding: 15% 10% ;
        padding-top:100px ;
        width: 80vw;
    }
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


const Welcome = styled.input`
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
`

const LoginForm = styled.form`
    display:flex;
    flex-direction: column;
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
                            <Title>SIGN UP</Title>
                            <LoginForm onSubmit={onSubmit}>
                                <IdLogIn onChange={onChange} name="email" type="text" placeholder="Email" required value={email}/>
                                <PassLogIn onChange={onChange} name="password" type="password" placeholder="Password" required value={password}/>
                                <Welcome type="submit" value={"Sign Up"} style={{fontSize:"18px"}}/>
                            </LoginForm>
                        </LoginBox>
                    </LoginOverlay>
                ) : null}
        </AnimatePresence>
    );
}

export default Auth;