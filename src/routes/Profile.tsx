import styled from "styled-components";
import { useRecoilValue } from "recoil";
import { isLogin } from "../atom";
import { Link } from "react-router-dom";

const Wrapper = styled.div`
    height: 90vh;
    width: 100vw;
    margin-top: 60px;
`

const FalseWrapper = styled(Wrapper)`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

const Button = styled.button`
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

function Profile() {
    const checkLog = useRecoilValue(isLogin);
    return (
        <>
            {checkLog ? <Wrapper></Wrapper> : <FalseWrapper>
                <div style={{marginBottom : "50px", fontSize:"42px"}}>로그인 후 사용하실수 있습니다!</div>
                <Link to="/login"><Button >LogIn</Button></Link>
                </FalseWrapper>}
        </>
    );
}

export default Profile;