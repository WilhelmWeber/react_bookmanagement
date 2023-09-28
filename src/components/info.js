import React, { useEffect, useState, useContext } from 'react';
import { doc, query, where, collection, updateDoc, getDocs } from 'firebase/firestore';
import { infoContext } from '../App';
import { db } from './firebase';
import '../style.css';

const Info = () => {

    const { info } = useContext(infoContext);
    const [display, setDisplay] = useState({});
    //モード変更
    const [change, setChange] = useState(true);
    
    //document_idとuserIDを表示から消去
    useEffect(() => {
        const copy = Object.assign({}, info);
        delete copy['uID'];
        delete copy['document_id'];
        setDisplay(copy);
    }, [info]);
    
    //オブジェクト空がどうか判定用
    const isObjectEmpty = (info) => {
        if ( Object.keys(info).length === 0 ) {
            return true;
        } else {
            return false;
        }
    };

    //書誌情報更新用
    const submitHandler = (e) => {
        e.preventDefault();
        let update = {};
        for (let key of Object.keys(display)) {
            update[key] = e.target[key].value;
        }
        update['uID'] = info['uID'];
        update['document_id'] = info['document_id'];
        const q = query(collection(db, 'books'), where('document_id', '==', info.document_id));
        getDocs(q).then((snapShot) => {
            snapShot.docs.map( async (elem) => {
                try {
                    await updateDoc(doc(db, 'books', elem.id), update);
                    alert('書誌情報は更新されました');
                } catch (error){
                    alert(error);
                }
            });
        });
        setChange(true);
    };

    if (isObjectEmpty(display) === false) {

        return(
            <div className='info'>
                { change===true ? (
                    <>
                    <dl class="max-w-md text-gray-900 divide-y divide-gray-200 dark:text-white dark:divide-gray-700">
                        {Object.keys(display).map(key => (
                            <div class="flex flex-col pb-3">
                                 <dt class="mb-1 text-gray-500 md:text-lg dark:text-gray-400">{ key }</dt>
                                 <dd class="text-lg font-semibold">{ display[key] }</dd>
                            </div>
                         ))}
                    </dl>
                    <button class="px-2 py-1 bg-red-400 text-white font-semibold rounded hover:bg-red-500" onClick={() => setChange(false)}>書誌情報を変更する</button>
                    </>
                ) : (
                    <>
                    <form className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4' onSubmit={submitHandler}>
                        {Object.keys(display).map(key => (
                            <div>
                                <label className='block text-gray-700'>
                                    { key }
                                </label>
                                <input type='text' name={key} defaultValue={display[key]} className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'/>  
                            </div>  
                        ))}
                        <input type='submit' value='更新' className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"/>
                    </form>
                    </>
                )}
            </div>
        );

    } else {
        return(
            <div className="info">
                <h1>選択してください</h1>
            </div>
        );
    }
   
};

export default Info;