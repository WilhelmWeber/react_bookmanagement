import React, { useState, useEffect } from 'react';
import { query, collection, getDocs } from 'firebase/firestore';
import Info from './info';
import MemoBase from './memoBase';
import List from './list';
import { db } from './firebase';

const ModeChange = ({ mode }) => {
    //ここでメモの全情報を取ってくる
    const [allMemos, setAllMemos] = useState([]);

    useEffect(() => {
        const q = query(collection(db, "memos"));
        getDocs(q).then((snapShot) => {
            setAllMemos(snapShot.docs.map((doc) => ({ ...doc.data(), id:doc.id })));
        });
    }, []);

    switch (mode) {
        case 'info':
            return (
                <Info />                          
            );
        case 'memo':
            return (
                <MemoBase allMemos={allMemos}/>
            );
        case 'list':
            return (
                <List />
            );
        default:
            return;
    }

};

export default ModeChange;