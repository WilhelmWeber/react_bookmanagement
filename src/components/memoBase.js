//memo.jsではなくここでmemoデータを取ってきて、memo.jsとmemoEditor.jsにpropsとして渡す
//buttonによって、メモ閲覧かメモ編集かを切り替える
import Memo from './memo';
import MemoEditor from './memoEditor';
import React, { useEffect, useState, useContext } from 'react';
import { db } from './firebase';
import { query, where, collection, getDocs } from 'firebase/firestore';
import { infoContext, authContext } from '../App';

const MemoBase = ({ allMemos }) => {

    const auth = useContext(authContext);
    //モード変更用（MemoEditorにはPropsで渡してMemoEditor側で変えてもらう）
    const [modeChange, setModeChange] = useState(true);
    //メモ全データを予め取ってくる（firebase取得の節約）
    //メモデータ保持用（リストで返ってくる）
    const [memo, setMemo] = useState(null);
    //検索用の書誌情報idはグローバルから取ってくる
    const { info } = useContext(infoContext);

    //info変更時に当該IDのメモをmemoにsetする
    useEffect(() => {
        if (info.document_id === undefined) return;
        const _memo = allMemos.filter(function(value) {
            return value.document_id === info.document_id
        });
        setMemo(_memo);
    }, [info])

    if (modeChange === true) {

        if (memo && info) {
            return (
                <div className='MemoBase'>
                    <Memo memo={memo[0]} />
                    <button class="px-2 py-1 bg-red-400 text-white font-semibold rounded hover:bg-red-500" onClick={() => setModeChange(false)}>メモを編集する</button>
                </div>
            );
        } else {
            return (
                <div className='MemoBase'>
                    <p>選択してください</p>
                </div>
            );
        
        }

    } else {

        return (
            <div className='MemoBase'>
                <MemoEditor beforeMemo={memo[0]} setModeChange={setModeChange} id={memo[0].id} />
            </div>
        );

    }

};

export default MemoBase;
