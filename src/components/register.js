import React, { useState, useContext } from 'react';
import { db, storage } from './firebase';
import { collection, addDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { ref, uploadBytes } from 'firebase/storage'
import { authContext } from '../App';
import '../style.css';
const bibtexParse = require('bibtex-parse-js');

const Register = ({ show, setShow }) => {

    const [test, setTest] = useState();
    const [memo, setMemo] = useState();
    const [pdf, setPDF] = useState(null);
    //ユーザー情報
    const { auth } = useContext(authContext);
    
    //ファイル読み込みとBibTexのパース（IDの付与）
    const fileReader = async (file) => {
        const reader = new FileReader();
        reader.onerror = (error) => console.error(error);
        reader.onload = (e) => {
            const _parsed = bibtexParse.toJSON(e.target.result);
            const parsed = _parsed[0].entryTags;
            const document_id = uuidv4();
            parsed['document_id'] = document_id;
            parsed['uID'] = auth.id;
            setTest(parsed);
            //メモ登録用データの設定
            setMemo({'document_id':document_id, 'memo':'', 'uID':auth.id});
        };
        reader.readAsText(file);
    };

    const onFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            fileReader(file);
        };
    };

    const onPDFChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPDF(file);
        }
    };

    //データベースへの登録
    const onClickSubmit = async (e) => {
        //リロードの阻止
        e.preventDefault();
        if (test) {
            try {
                await addDoc(collection(db, 'books'), test);
            } catch (error) {
                console.log(error);
            }
        }
        try {
            await addDoc(collection(db, 'memos'), memo);
        } catch (error) {
            console.log(error);
        }
        if (pdf) {
            const storageRef = ref(storage, `PDF/${test['document_id']}.pdf`);
            uploadBytes(storageRef, pdf)
              .then((snapShot) => console.log('file uploaded'))
              .catch((error) => console.log(error));
        }
        setShow(false);
        alert('情報のアップロードが完了しました。')
    };

    const Register = {
        background: "white",
        padding: "10px",
        borderRadius: "3px",
    };

    const overlay = {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
    
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    };

    if (show===true) {
        return(
            <div className='overlay' style={overlay}>
              <div className="Register" style={Register}>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">書誌情報登録</label>
                <input className="block w-50 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="bib_input" type="file" accept=".bib" onChange={onFileChange} />
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">pdfファイル登録</label>
                <input className="block w-50 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="pdf_input" type="file" accept=".pdf" onChange={onPDFChange} />
                <div className='flex flex-row space-x-10'>
                    <button className="bg-gray-800 hover:bg-gray-700 text-white rounded px-4 py-2" onClick={onClickSubmit}>登録</button>
                    <button className="bg-red-800 hover:bg-red-700 text-white rounded px-4 py-2" onClick={() => setShow(false)}>やめる</button>
                </div>
              </div>
            </div>
        );
    } else {
        return null;
    }
};

export default Register;