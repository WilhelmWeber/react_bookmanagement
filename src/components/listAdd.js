//リスト新規作成用コンポーネント
//初回レンダー時にはボタンが表示され、ボタンを押すとフォームと投稿ボタンが表示される
//投稿する際のリスト名が既に存在しているものであればこの名前は登録できませんと表示、フォームに何もなくても登録できませんと表示
import React, { useState, useContext } from 'react';
import { db } from './firebase';
import { query, where, collection, getDocs, addDoc } from 'firebase/firestore';
import { authContext } from '../App';
import '../style.css';

const ListAdd = () => {

    const [modeChange, setModeChange] = useState(true);
    const [listName, setListName] = useState('');
    const { auth } = useContext(authContext);

    const onChangeSetName = (e) => {
        setListName(e.target.value);
    };

    //投稿されたときに同じ名前であるかどうか、名前が空でないかどうかはここで判断することにする。
    const submitHandler = async (e) => {
        e.preventDefault();
        //名前が空だったら登録させない
        if (listName.length === 0) {
            alert('名前を入力してください');
            return;
        }
        //名前が既存のリスト名と被るのであれば登録させない
        if (isNotSameName(listName) === false) {
            alert('この名前は既に使用されています');
            return;
        }
        const data = {listname:listName, uID:auth.id}
        try {
            await addDoc(collection(db, 'Lists'), data)
        } catch (error) {
            console.log(error);
        }
        setModeChange(true);
    }

    const isNotSameName= async (listname) => {
        const q = query(collection(db, 'Lists'), where("listname", "==", listname), where("uID", "==", auth.id));
        const doc = await getDocs(q);
        if (doc.docs.length === 0) {
            return true;
        } else {
            return false;
        }
    };

    if (modeChange === true) {
        
        return (
            <div className='listAdd'>
                <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => setModeChange(false)}>新たなリストを作成する</button>
            </div>
        );

    } else {

        return (
            <div className='listAdd'>
                <form onSubmit={submitHandler}>
                    <label>
                        リスト名:
                        <input type='text' defaultValue="" onChange={onChangeSetName}/>
                        <input type='submit' />
                    </label>
                </form>
            </div>  
        );

    }
};

export default ListAdd;