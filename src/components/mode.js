//モード変更用のコンポーネント
//書誌情報（info.js）、メモ（memoBase.js）、タグ（tag.js）をセレクトボックスにて表示切替
import React, { useState } from 'react';
import ModeChange from './modeChange';

const Mode = () => {

    const [mode, setMode] = useState('info');

    const onChange = (e) => {
        setMode(e.target.value);
    };

    return (
        <div className='mode'>
          <select onChange={onChange}>
              <option value="info">書誌情報</option>
              <option value="memo">メモ</option>
              <option value="list">リスト管理</option>
          </select>
          <ModeChange mode={mode}/>
        </div>
    );

};

export default Mode;