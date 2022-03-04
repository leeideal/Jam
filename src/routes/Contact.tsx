import { useRef } from "react";
import styled from "styled-components";
import { motion, Variants } from "framer-motion";

const Wapper = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`

const Title = styled.div`
    margin-bottom: 50px;
    font-size: 32px;
    font-weight: 600;
`

const MyProfileBox = styled.div`
    width: 70%;
    height: 70%;
    border-radius: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
`

const MyProfile = styled(motion.div)`
    width: 50%;
    height: 25%;
    border-radius: 50px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    box-shadow: rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px;
`

const MyName = styled.div`
    font-size: 28px;
    font-weight: 500;
    margin-bottom: 30px;
`

const MyInfo = styled.a`
    margin-bottom: 5px;
`

const boxVariante : Variants = {
    hover : {
        boxShadow: "rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px"
    },
    click: {
        width : "25%",
        borderRadius: "50%" ,
        boxShadow: "rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px"
    },
    
}

function Contact() {
    const myProfileBoxRef = useRef<HTMLDivElement>(null)

    return (
        <Wapper>
            <Title>Want to know the Creator?</Title>
            <MyProfileBox ref={myProfileBoxRef}>
                <MyProfile
                drag
                dragConstraints = {myProfileBoxRef}
                variants={boxVariante}
                whileTap = "click"
                whileHover="hover">
                    <MyName>이상돈</MyName>
                    <MyInfo href="https://github.com/leeideal">GitHub Page</MyInfo>
                    <MyInfo href="https://leeideal.github.io/">GitHub Blog </MyInfo>
                    <MyInfo>sangdon10@naver.com</MyInfo>

                </MyProfile>
            </MyProfileBox>
        </Wapper>
    );
}

export default Contact;