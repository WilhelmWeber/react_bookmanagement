import React, { useState, useEffect, useRef, useContext } from "react";
import { query, where, collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import { authContext } from "../App";

const ListSelect = ({ setBooksInList }) => {
    const { auth } = useContext(authContext);
    //listsはリスト名をキーとして、そのリストにある文書IDの配列が値として入っている
    const [books, setBooks] = useState({});
    const selectRef = useRef(null);

    useEffect(() => {
        const document_id_take = async (listid) => {
            const colRef = collection(db, 'Lists', listid, 'documents');
            return (await getDocs(colRef)).docs.map((doc) => ({ ...doc.data()}));
        };

        const q = query(collection(db, 'Lists'), where('uID', '==', auth.id));
        getDocs(q).then((snapShot) => {
            let asyncs = [];
            const lists_taken = snapShot.docs.map((doc) => ({ ...doc.data(), id:doc.id }));
            for (let list of lists_taken) {
                asyncs.push(document_id_take(list.id));
            }
            Promise
              .all(asyncs)
              .then((value) => {
                let data = {};
                for (let i=0; i<lists_taken.length; i++) {
                    data[lists_taken[i].listname] = value[i];
                }
                setBooks(data);
              });
        });
    }, []);

    const selectHandler = () => {
        const listid = selectRef.current.value;
        if (listid!=="all") {
            setBooksInList(books[listid]);
        } else {
            setBooksInList(null);
        }
    };

    return (
        <div className='flex flex-row'>
            <select className="py-3 px-4 pr-9 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400" ref={selectRef}>
                <option value='all' selected>全て</option>
                {Object.keys(books).map((list) => (
                    <option value={list}>{ list }</option>
                ))}
            </select>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-light h-15 px-8 m-2 rounded" onClick={selectHandler}>リストを選択</button>
        </div>
    );
};

export default ListSelect;