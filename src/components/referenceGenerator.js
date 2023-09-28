import React, { useEffect, useState } from 'react';

const ReferenceGenerator = ({ showReferences, setShowReferences, books }) => {
    const [refereces, setReferences] = useState('');

    //モーダル用のスタイル
    const content = {
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

    useEffect(() => {
        let _references = '';
        for (let book of books) {
            if (book.journal) {
                _references += `${book.author}. "${book.title}." ${book.journal} ${book.number ? `${book.volume}.${book.number}`: book.volume} (${book.year}): ${book.pages}\n`;
            } else {
                _references += `${book.author}. ${book.title}. ${book.publisher}, ${book.year}\n`
            }
        }
        setReferences(_references);
    }, [books]);

    if (showReferences===true) {
        return (
            <div className='overlayRef' style={overlay}>
                <div className='contentRef' style={content}>
                    <textarea rows={10} cols={150}>
                        {refereces}
                    </textarea>
                    <button  onClick={() => setShowReferences(false)}>表示をやめる</button>
                </div>
            </div>
        );
    } else {
        return null;
    }
};

export default ReferenceGenerator;