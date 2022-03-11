import { Link, useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion, useAnimation, useViewportScroll } from "framer-motion";
import { useEffect } from "react";
import { getAuth } from "firebase/auth";
import { useRecoilState } from "recoil";
import { isLogin } from "../atom";

const Navbox = styled(motion.nav)`
    width: 100%;
    display: flex;
    position: fixed;
    justify-content: space-around;
    align-items: center;
    top: 0;
    height: 60px;
    font-size: 20px;
    padding: 20px 60px;
    border-bottom: 1px solid rgba(0,0,0,0.2);
    z-index: 20;
`

// const Items = styled.div`
//     @media (max-width: 450px) {
//         width: 38vh;
//     }
//     display: flex;
//     align-items: center;
// `;

const Items = styled.div`
    @media (max-width: 450px) {
        width: 38vh;
        margin-left: 20px;
    }
    display: flex;
    align-items: center;
`;

// const Item = styled.div`
//     @media (max-width: 450px) {
//         width: 40px;
//         font-size: 16px ;
//     }
//     @media (max-height: 780px) {
//         width: 38px;
//         margin-right: 15px;
//         font-size: 14px;
//     }
//     position: relative;
//     width: 100px;
//     margin-right: 20px;
//     display: flex;
//     text-align: center;
//     justify-content: center;
//     flex-direction: column;
//     cursor: pointer;
//     div:hover {
//         transition: color 0.3s ease-in-out;
//         color: red;
//     }
// `
const Item = styled.div`
    @media (max-width: 450px){
        width: 40px;
        font-size: 16px ;
    }
    @media (max-height: 700px) {
        width: 38px;
        margin-right: 15px;
        font-size: 14px;
    }
    @media (max-height: 700px) and (min-width: 680px){
        font-size: 20px ;
        margin-right: 50px;
    }
    position: relative;
    width: 100px;
    margin-right: 20px;
    display: flex;
    text-align: center;
    flex-direction: column;
    justify-content: center;
    align-items:center;
    cursor: pointer;
    div:hover {
        transition: color 0.3s ease-in-out;
        color: red;
    }
`

const Here = styled(motion.div)`
    position: absolute;
    bottom: -5px;
    width: 40px;
    height: 4px;
    border-radius: 10px;
    background-color: red;
`

const Button = styled.div`
    @media (max-width: 450px) {
        font-size: 16px ;
        height: 19px;
    }
    @media (max-height: 700px) {
        font-size: 14px ;
        margin-left: 50px;
        margin-top: 2px;
    }
    @media (max-height: 700px) and (min-width: 680px){
        font-size: 20px ;
    }
    margin-left: 30px;
    width: 50px;
    transition: color 0.3s ease-in-out;
    height: 26px;
    border : none;
    cursor: pointer;
    &:hover {
        color: red;
    }
`

const navVariants = {
    top: {
      backgroundColor: "rgba(0, 0, 0, 0)",
      color: "black"
    },
    scroll: {
      backgroundColor: "rgba(0, 0, 0, 1)",
      color: "white"
    },
};


function Navbar() {
const {scrollY} = useViewportScroll();
const navAnimation = useAnimation();
const homem = useMatch("/Jam");
const sessionm = useMatch("/Jam/session");
const concertm = useMatch("/Jam/concert");
const profilem = useMatch("/Jam/profile");
const contactm = useMatch("/Jam/contact");
const auth = getAuth();
const navigate = useNavigate();
const [checkLog, setCheckLog]= useRecoilState(isLogin);


useEffect(() => {
        scrollY.onChange(() => {
          if (scrollY.get() > 100) {
            navAnimation.start("scroll");
          } else {
            navAnimation.start("top");
          }
        });
}, [scrollY.get()])

const onLogOutClick = () => {
    auth.signOut();
    navigate("/Jam");
    localStorage.clear();
    auth.signOut();
}


return (
    <Navbox variants={navVariants} animate={navAnimation} initial={"top"}>
        <Items>
            <Item>
                <div onClick={()=> navigate("/Jam")}>Home</div>
                {homem && <Here layoutId="here"/>}
            </Item>
            <Item>
                <div onClick={()=> navigate("/Jam/session")}>Session</div>
                {sessionm && <Here layoutId="here"/>}
            </Item>
            <Item>
                <div onClick={()=> navigate("/Jam/concert")}>Concert</div>
                {concertm && <Here layoutId="here"/>}
            </Item>
            <Item>
                <div onClick={()=> navigate("/Jam/profile")}>Profile</div>
                {profilem && <Here layoutId="here"/>}     
            </Item>
            <Item>
                <div onClick={()=> navigate("/Jam/contact")}>Contact</div>
                {contactm && <Here layoutId="here"/>}
            </Item>
        </Items>
        {checkLog ? <Button onClick={onLogOutClick}>LogOut</Button> : <Link to="/Jam/login"><Button >LogIn</Button></Link> } 
    </Navbox>
    );
}

export default Navbar;