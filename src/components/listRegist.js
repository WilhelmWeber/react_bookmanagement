//書誌情報をリストに登録するコンポーネント
//初回レンダリングするときに、その本が当該リストに登録されているかどうかを確認
//登録されていなければ登録ボタン、登録されていれば削除ボタンを表示
import React, { useState, useEffect } from 'react'
import { query, where, collection, getDocs, doc, deleteDoc, addDoc } from 'firebase/firestore';
import { db } from './firebase';
import '../style.css';

const ListRegist = ({ book, list }) => {

    //モードセレクト用（初回レンダリング時にuseEffectで初期値を決めるため引数はなし）
    const [modeSelect, setModeSelect] = useState();

    //当該資料がリストにあるとき→true　ないとき→false
    useEffect(() => {
        const isBookinList = async () => {
            const q = query(collection(db, 'Lists', list.id, 'documents'), where("document", "==", book.document_id));
            const doc = await getDocs(q);
            if (doc.docs.map(doc => doc.data()).length !== 0) {
                setModeSelect(true);
            } else {
                setModeSelect(false);
            }
        };
        isBookinList();
    }, [book]);

    //資料をリストに登録（登録したら、モードをtrueにして削除ボタンを表示）
    const onClickRegist = async (e) => {
        e.preventDefault();
        try {
            const data = {document:book.document_id}
            await addDoc(collection(db, 'Lists', list.id, 'documents'), data);
        } catch (error) {
            console.log(error);
        }
        setModeSelect(true);
    };

    //資料をリストから削除（登録したら、モードをfalseにして登録ボタンを表示）
    const onClickDelete = async (e) => {
        e.preventDefault();
        try {
            const q = query(collection(db, 'Lists', list.id, 'documents'), where("document", "==", book.document_id));
            const d = await getDocs(q);
            const id = d.docs.map((doc) => (doc.id));
            await deleteDoc(doc(db, 'Lists', list.id, 'documents', id[0]));
        } catch (error) {
            console.log(error);
        }
        setModeSelect(false);
    }


    if (modeSelect === true) {
        return (
            <p>{ list.listname }:<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={onClickDelete}>この資料を削除する</button></p>
        );
    } else  {
        return (
            <p>{ list.listname }:<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={onClickRegist}>この資料を追加する</button></p>
        );
    }
};

export default ListRegist;