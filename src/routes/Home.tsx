import styled from "styled-components";
import { motion, useAnimation, useViewportScroll} from "framer-motion";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Login from "../components/Login";

const Wrapper = styled.div`
    height: 250vh;
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
    background:#1AAB8A;
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
        color:#1AAB8A;
    }
    &:before, &:after{
        content:'';
        position:absolute;
        top:0;
        right:0;
        height:2px;
        width:0;
        background: #1AAB8A;
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

const Footer = styled.footer`
    height: 15vh;
    width: 100vw;
    display: flex;
    align-items: center;
`

const cellVariants = {
    top: {
        opacity : 0
    },
    scroll: {
        opacity : 1
    },
};


function Home() {
    const {scrollY} = useViewportScroll();
    const cellAnimation = useAnimation();

    useEffect(() => {
    //   scrollY.onChange(() => console.log(scrollY.get()));
        scrollY.onChange(() => {
            if (scrollY.get() > 180) {
            cellAnimation.start("scroll");
            } else {
            cellAnimation.start("top");
            }
        });
        }, [scrollY])
    return (
        <Wrapper>
            <Cell>
                <Img src="https://images.unsplash.com/photo-1563841930606-67e2bce48b78?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=872&q=80" />
                <Write>
                    <div>Jam</div>
                    <div>당신의 음악을 사람들과 즐겨보세요!</div>
                    <Link to="/login"><Button >LogIn</Button></Link>    
                    {/* 로그인 페이지 만들고, Recoil로 로그인 했는지 안했는지 판한해서 
                        안했으면 -> 로그인 페이지, 했으면 -> 개인 프로필 페이지*/}
                </Write>
            </Cell>
            <CellM variants={cellVariants} transition={{duration : 0.4}} animate={cellAnimation} initial={"top"}>
                <Write>
                    <div>Jam</div>
                    <div>다양한 사람들과 함께 음악을 즐겨보세요!</div>
                </Write>
                <Img src="https://images.unsplash.com/photo-1525018923-1ebe8261a6a6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=627&q=80" />
            </CellM>
            <Login />
            <Footer>&copy; {new Date().getFullYear()} Jam (Made by leeIdeal)</Footer>
        </Wrapper>
    );
}

export default Home;