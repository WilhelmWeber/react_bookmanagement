//文献リスト生成用コンポーネント
//新しい資料リストを追加、当該資料をどのリストに追加するかを選択する。
//リスト用のコレクションを用意して、それに当該文献のdocument_idを追加することで、管理する。
//リスト登録用コンポーネント、リストに史料を追加するコンポーネントをここにおく。
import React, { useState, useEffect, useContext } from "react";
import { query, where, collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import { infoContext, authContext } from "../App";
import ListRegist from "./listRegist";
import ListAdd from "./listAdd";


const List = () => {

    const { info } = useContext(infoContext);
    const [lists, setLists] = useState([]);
    const { auth } = useContext(authContext);

    //リスト一覧を取ってくる
    useEffect(() => {
        const q = query(collection(db, 'Lists'), where('uID', '==', auth.id));
        getDocs(q).then((snapShot) => {
            const lists_taken = snapShot.docs.map((doc) => ({ ...doc.data() }));
            const ids = snapShot.docs.map((doc) => (doc.id));
            lists_taken.map((list, i) => {
                list['id'] = ids[i];
            })
            setLists(lists_taken);
        });
    }, []);

        return (
            <div className="list">
                {
                    lists ? (
                        <div className="listHandle">
                            {lists.map((list) => (
                                <ListRegist book={info} list={list}/>                       
                            ))}
                            <ListAdd />
                        </div>
                    ) : (
                        <div className="listHandle">
                            <p>選択してください</p>
                        </div>
                    )
                }
            </div>
        );

};

export default List;