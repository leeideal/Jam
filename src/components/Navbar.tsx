import { Link, useMatch } from "react-router-dom";
import styled from "styled-components";
import { motion, useAnimation, useViewportScroll } from "framer-motion";
import { useEffect } from "react";

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
`

const Items = styled.ul`
    display: flex;
    align-items: center;
`;

const Item = styled.li`
    position: relative;
    width: 100px;
    margin-right: 20px;
    transition: color 0.3s ease-in-out;
    display: flex;
    text-align: center;
    justify-content: center;
    flex-direction: column;
    &:hover {
        color: red;
    }
`

const Here = styled(motion.div)`
    position: absolute;
    width: 40px;
    height: 4px;
    border-radius: 10px;
    background-color: red;
    left : 30%;
    bottom: -10px;
`

const Button = styled.div`
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
const homem = useMatch("/");
const sessionm = useMatch("/session");
const concertm = useMatch("/concert");
const profilem = useMatch("/profile");
const contactm = useMatch("/contact");

useEffect(() => {
        scrollY.onChange(() => {
          if (scrollY.get() > 70) {
            navAnimation.start("scroll");
          } else {
            navAnimation.start("top");
          }
        });
      }, [scrollY, navAnimation]);

    return (
        <Navbox variants={navVariants} animate={navAnimation} initial={"top"}>
            <Items>
                <Item>
                    <Link to="/"> {homem && <Here layoutId="here"/>}Home</Link>
                </Item>
                <Item>
                    <Link to="/session"> {sessionm && <Here layoutId="here"/>}Session</Link>    
                </Item>
                <Item>
                    <Link to="/concert"> {concertm && <Here layoutId="here"/>}Concert</Link>
                </Item>
                <Item>
                    <Link to="/profile"> {profilem && <Here layoutId="here"/>}Profile</Link>    
                </Item>
                <Item>
                    <Link to="/contact"> {contactm && <Here layoutId="here"/>}Contact</Link>    
                </Item>
            </Items>
            <Link to="/login"><Button >LogIn</Button></Link>  
                {/* 로그인 했으면, 로그아웃 버튼 만들기 -> Recoil로 받아와서 */}
        </Navbox>
    );
}

export default Navbar;