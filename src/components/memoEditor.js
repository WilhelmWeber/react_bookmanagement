import React, { useState } from 'react';
import SimpleMde from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

const MemoEditor = ({ beforeMemo, setModeChange, id }) => {

    const [memo, setMemo] = useState(beforeMemo.memo);

    const onChange = (value) => {
        setMemo(value);
    };

    //メモ更新用
    const saveMemo = async (e) => {

      e.preventDefault();
      if (memo) {

        const data = {document_id:beforeMemo.document_id, memo:memo};
        const docref = doc(db, 'memos', id)
        try {
          await updateDoc(docref, data);
        } catch (error) {
          console.log(error);
        }
      }
      setModeChange(true);

    };

    return (
        <div className='markdown'>
          <SimpleMde value={memo} onChange={onChange} />
          <button class="px-2 py-1 bg-red-400 text-white font-semibold rounded hover:bg-red-500" onClick={saveMemo}>メモを保存する</button>
          <div>
            <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(marked(memo))}}></div>
          </div>
        </div>
    );

};

export default MemoEditor;