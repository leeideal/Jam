import { AnimatePresence, motion } from "framer-motion";
import { useMatch, useNavigate} from "react-router-dom";
import styled from "styled-components";


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
`

function Login() {
    const loginMatch = useMatch("/login");
    const navigate = useNavigate();
    const onOverlayClick = () => navigate("/");
    return (
        <AnimatePresence>
            {loginMatch ? (
                    <LoginOverlay onClick={onOverlayClick} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <LoginBox>
                            로그인화면
                        </LoginBox>
                    </LoginOverlay>
                ) : null}
        </AnimatePresence>
    );
}

export default Login;