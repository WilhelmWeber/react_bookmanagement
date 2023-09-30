//ログインを担当するコンポーネント
//ログイン情報はコンテクストで管理する？
import React, { useContext, useEffect } from 'react';
import { signInWithPopup } from "firebase/auth";
import { fbauth, provider } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { authContext } from "../App";
import '../style.css';

const Login = () => {
    const [user] = useAuthState(fbauth);
    const { setAuth } = useContext(authContext);

    useEffect(() => {
        if (user) {
            const data = {
                id: fbauth.currentUser.uid,
                name: fbauth.currentUser.displayName,
            };
            setAuth(data);
        }
    }, [user])

    const signin = () => {
        signInWithPopup(fbauth, provider)
          .catch((error) => {
            alert(error.message);
          })
    };

    return (
        <div className="flex h-screen justify-center items-center flex-col">
            <div className="w-full h-screen bg-[url('https://img.freepik.com/free-photo/old-opened-book-is-christian-psalter_1398-747.jpg')] bg-cover bg-center">
                <div className="w-full h-full flex flex-col justify-center items-center backdrop-brightness-50 gap-y-10">
                    <p className="text-bold text-white text-3xl">文献管理アプリへようこそ</p>
                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={signin}>Googleアカウントでサインインする</button>
                </div>
            </div>
        </div>
    );
};

export default Login;