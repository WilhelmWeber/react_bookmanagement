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
        <div className="login">
            <p>Zoteroクローンへようこそ。今すぐGoogleアカウントで文献管理を始めましょう。</p>
            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={signin}>Googleアカウントでサインインする</button>
        </div>
    );
};

export default Login;