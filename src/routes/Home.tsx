import styled from "styled-components";
import { motion, useAnimation, useViewportScroll} from "framer-motion";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Login from "../components/Login";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRecoilState } from "recoil";
import { isLogin } from "../atom";

const Wrapper = styled.div`
    width: 100vw;
    margin-top: 60px;
`

const Cell = styled.div`
    height: 90vh;
    width: 100vw;
    display: flex;
`

const CellM = styled(motion.div)`
    height: 90vh;
    width: 100vw;
    display: flex;
`

const Img = styled.img`
    width: 50vw;
`

const Write = styled.div`
    width: 50vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

const Button = styled(motion.button)`
    @media screen and (max-width: 450px) {
        padding: 0 0.3em ;
    }
    margin-top: 100px;
    background:#8fc4ee;
    color:#fff;
    border:none;
    position:relative;
    height:40px;
    font-size:1.6em;
    padding:0 1em;
    cursor:pointer;
    transition:800ms ease all;
    outline:none;
    &:hover{
        background:#fff;
        color:#8fc4ee;
    }
    &:before, &:after{
        content:'';
        position:absolute;
        top:0;
        right:0;
        height:2px;
        width:0;
        background: #8fc4ee;
        transition:400ms ease all;
    }
    &:after{
        right:inherit;
        top:inherit;
        left:0;
        bottom:0;
    }
    &:hover:before,&:hover:after{
        width:100%;
        transition:800ms ease all;
    }
`

const Title = styled.div`
    font-size: 48px;
    font-weight: 600;
    margin-bottom: 100px;
    @media screen and (max-width: 450px) {
        font-size: 28px;
    }
`

const Msg = styled.div`
    font-size: 24px;
    width: 80%;
    text-align: center;
    line-height: 200% ;
    text-align: center;
    @media screen and (max-width: 450px) {
        font-size: 16px;
    }
`

const cellVariants = {
    top: {
        opacity : 0
    },
    scroll: {
        opacity : 1
    },
};

const cellVariants2 = {
    top: {
        opacity : 0
    },
    scroll: {
        opacity : 1
    },
};

const NoMobile = styled.div`
    @media screen and (min-width: 360px) and (min-height:780px) {
        display: none;
  }
  position: absolute;
  z-index: 99;
  height: 100vh;
  background-color: #263238;
  color : white;
  width: 100vw;
  display: flex;
  top: 0;
  justify-content: center;
  align-items: center;
  font-size: 26px;
`


function Home() {
    const {scrollY} = useViewportScroll();
    const cellAnimation = useAnimation();
    const cellAnimation2 = useAnimation();
    const auth = getAuth();
    const [checkLog, setCheckLog]= useRecoilState(isLogin);


    useEffect(() => {
    //   scrollY.onChange(() => console.log(scrollY.get()));
        scrollY.onChange(() => {
            if (scrollY.get() > 180) {
            cellAnimation.start("scroll");
            } else {
            cellAnimation.start("top");
            }
            if (scrollY.get() > 1150) {
            cellAnimation2.start("scroll");
            } else {
            cellAnimation2.start("top");
            }
        });
        }, [scrollY])
      
      
    useEffect(()=>{
        onAuthStateChanged(auth, (user) => {
          if (user) {
              setCheckLog(true);
            }else {
            setCheckLog(false);
            }
            console.log(checkLog);
            console.log(user);
            })
        },[]) 
  
    return (
        <Wrapper>
            <Cell>
                <Img src="https://images.unsplash.com/photo-1563841930606-67e2bce48b78?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=872&q=80" />
                <Write>
                    {checkLog === true ? <><Title>시작하세요!</Title>
                    <Msg>팀을 만들어 당신의 음악을 즐기세요!</Msg>
                    <Link to="/concert"><Button>Jam하러가기</Button></Link>
                    </>  :
                    <><Title>환영합니다!</Title>
                    <Msg>Jam에 오신걸 환영합니다!</Msg>
                    <Link to="/login"><Button >LogIn</Button></Link>
                    </>} 
                </Write>
            </Cell>
            <CellM variants={cellVariants} transition={{duration : 0.3}} animate={cellAnimation} initial={"top"}>
                <Write>
                    <Title>About Jam</Title>
                    <Msg>Jam에서 다양한 사람들과 자유롭게 매칭하고 합주를 즐겨보세요!</Msg>
                </Write>
                <Img src="https://images.unsplash.com/photo-1525018923-1ebe8261a6a6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=627&q=80" />
            </CellM>
            <CellM variants={cellVariants2} transition={{duration : 0.3}} animate={cellAnimation2} initial={"top"}>
                <Img src="https://images.unsplash.com/photo-1561264974-153c4dacddd2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80" />
                <Write>
                    <Title>Just Do It!</Title>
                    <Msg>많은 사람들이 당신을 기다리고 있습니다.
                        당신의 실력을 보여주세요!</Msg>
                </Write>
            </CellM>
            <NoMobile><div>화면이 너무 작습니다. 더 큰 화면으로 접속부탁드립니다.</div></NoMobile>
            <Login />
        </Wrapper>
    );
}

export default Home;