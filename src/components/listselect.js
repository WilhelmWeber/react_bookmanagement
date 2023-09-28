import React, { useState, useEffect, useRef, useContext } from "react";
import { query, where, collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import { authContext } from "../App";

const ListSelect = ({ setBooksInList }) => {
    const { auth } = useContext(authContext);
    const [lists, setLists] = useState([]);
    const selectRef = useRef(null);

    useEffect(() => {
        const q = query(collection(db, 'Lists'), where('uID', '==', auth.id));
        getDocs(q).then((snapShot) => {
            const lists_taken = snapShot.docs.map((doc) => ({ ...doc.data(), id:doc.id }));
            setLists(lists_taken);
        });
    }, []);

    const selectHandler = () => {
        const listid = selectRef.current.value;
        if (listid!=="all") {
            const colRef = collection(db, 'Lists', listid, 'documents');
            getDocs(colRef).then((snapShot) => {
                const document_ids = snapShot.docs.map((doc) => ({...doc.data()}));
                setBooksInList(document_ids) 
            })
        } else {
            setBooksInList(null);
        }
    };

    return (
        <div className='flex flex-row'>
            <select className="py-3 px-4 pr-9 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400" ref={selectRef}>
                <option value='all' selected>全て</option>
                {lists.map((list) => (
                    <option value={list.id}>{list.listname}</option>
                ))}
            </select>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-light h-15 px-8 m-2 rounded" onClick={selectHandler}>リストを選択</button>
        </div>
    );
};

export default ListSelect;