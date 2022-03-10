import styled from "styled-components";
import { useRecoilValue } from "recoil";
import { isLogin } from "../atom";
import { Link } from "react-router-dom";
import Logprofile from "../components/Fixprofile";

const Wrapper = styled.div`
    height: 90vh;
    width: 100vw;
    margin-top: 60px;
    display: flex;
    justify-content: center;
`

const FalseWrapper = styled(Wrapper)`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

const Button = styled.button`
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

const NoMobile = styled.div`
    @media screen and (min-width: 360px) and (min-height:550px) {
        display: none;
  }
  position: absolute;
  z-index: 99;
  height: 400%;
  background-color: #263238;
  color : white;
  width: 100vw;
  display: flex;
  top: 0;
  justify-content: center;
  align-items: center;
  font-size: 26px;
`

function Profile() {
    const checkLog = useRecoilValue(isLogin);
    return (
        <>
            {checkLog ? <Wrapper>
                <Logprofile />
            </Wrapper> : <FalseWrapper>
                <div style={{marginBottom : "50px", fontSize:"42px"}}>로그인 후 사용하실수 있습니다!</div>
                <Link to="/Jam/login"><Button >LogIn</Button></Link>
                </FalseWrapper>}
                <NoMobile>화면이 너무 작습니다.<br></br> 
            노트북이나 컴퓨터로 접속을 권장합니다.</NoMobile>
        </>
    );
}

export default Profile;