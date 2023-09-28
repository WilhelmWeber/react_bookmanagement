import React, { useEffect, useState, useContext } from 'react';
import { doc, query, where, collection, getDocs, deleteDoc } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { infoContext, authContext } from '../App';
import { db, storage } from './firebase';
import ReferenceGenerator from './referenceGenerator';
import ListSelect from './listselect';
import '../style.css';

const Views = () => {
    //最初に全本情報を取得
    const [allBooks, setAllBooks] = useState([]);
    //表示する本の配列
    const [books, setBooks] = useState([]);
    //参考文献を表示するかしないか
    const [showReferences, setShowReferences] = useState(false);
    //表示範囲をリストに絞る時に使用
    const [booksInList, setBooksInList] = useState(null);
    //詳細情報表示用
    const {info, setInfo} = useContext(infoContext);
    const { auth } = useContext(authContext);

    useEffect(() => {
      const q = query(collection(db, 'books'), where('uID', '==', auth.id));
      getDocs(q).then((snapShot) => {
          setAllBooks(snapShot.docs.map((doc) => ({ ...doc.data() })));
      });
    }, []);
 
    useEffect(() => {
        //booksInListが更新されると表示を変更
      if (booksInList) {
        const document_ids = booksInList.map((value) => value.document);
        const selectedBook = allBooks.filter((value) => {
          return value.dcoument_id in document_ids;
        });
        setBooks(selectedBook);
      } else {
        //表示範囲がnullであれば全部を取ってくる
        setBooks(allBooks);
      }
    }, [booksInList]);
    
    //infoを設定する
    const infoChange = (book) => {
        setInfo(book);
    };

    const onDragEnd = (result) => {
      const {source, destination} = result;
      if (!destination) {
        return;
      }
      const upDate = reorder(source.index, destination.index);
      setBooks(upDate);
    };

    const reorder = (start, end) => {
      const result = Array.from(books);
      const [removed] = result.splice(start, 1);
      result.splice(end, 0, removed);
      return result;
    };

    //文献ダウンロードURLを別枠で開く
    const urlHandler = (document_id) => {
      getDownloadURL(ref(storage, `PDF/${document_id}.pdf`))
        .then((url) => window.open(url))
        .catch(()=> alert('PDFがありません'));
    };

    const deleteHandler = (document_id, e) => {
      e.preventDefault();
      let result = window.confirm('ほんとうに削除しますか？')
      if (result) {
        const q1 = query(collection(db, 'books'), where('document_id', '==', document_id))
        getDocs(q1).then((snapShot) => {
          snapShot.docs.map(async (elem) => {
            try {
              await deleteDoc(doc(db, 'books', elem.id));
            } catch (error) {
              console.log(error);
            }
          });
        });
        const q2 = query(collection(db, 'memos'), where('document_id', '==', document_id))
        getDocs(q2).then((snapShot) => {
          snapShot.docs.map(async (elem) => {
            try {
              await deleteDoc(doc(db, 'memos', elem.id));
            } catch (error) {
              console.log(error);
            }
          });
        });
        const q3 = query(collection(db, 'Lists'), where('uID', '==', auth.id));
        getDocs(q3).then((snapShot) => {
          snapShot.docs.map((doc) => {
            const q = query(collection(db, 'Lists', doc.id, 'documents'), where("document", "==", document_id));
            getDocs(q).then((snapShot) => {
              snapShot.docs.map(async (elem) => {
                try {
                  await deleteDoc(doc(db, 'Lists', doc.id, 'documents', elem.id));
                } catch (error) {
                  console.log(error);
                }
              });
            });
          });
        });
        alert('削除処理を終了します')
      } else { return }
    };

    if (books.length === 0) {
      return (
        <div className='views'>
          <h1>書誌情報を登録してください</h1>
        </div>
      );
    }

    return(
        <div className='views'>
          <div className='flex'>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-medium h-10 px-5 m-2 rounded" onClick={() => setShowReferences(true)}>参考文献表を生成する</button>
            <ListSelect setBooksInList={setBooksInList}/>
            <ReferenceGenerator showReferences={showReferences} setShowReferences={setShowReferences} books={books}/>
          </div>
          <div className="table">
            <table className="table-auto border">
              <thead>
                <tr>
                <th class="border px-4 py-2">題名</th>
                <th class="border px-4 py-2">著者等</th>
                <th class="border px-4 py-2">年代</th>
                <th class="border px-4 py-2"></th>
                </tr>
              </thead>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId={"dndTableBody"}>
                  {(provided) => (
                    <tbody ref={provided.innerRef} {...provided.droppableProps}>
                      {books.map((book, index) => (
                        <Draggable draggableId={book.title} index={index} key={book.title}>
                          {(provided) => (
                            <tr ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                              <td class="border px-4 py-2"><a onClick={() => urlHandler(book.document_id)}>{book.title}</a></td>
                              <td class="border px-4 py-2">{book.author}</td>
                              <td class="border px-4 py-2">{book.year}</td>
                              {
                                book.title === info.title ? (
                                  <td><button class="bg-gray-800 hover:bg-gray-700 text-white rounded px-4 py-2"  onClick={() => infoChange(book)}>選択中</button></td>
                                ) : (
                                  <td><button class="bg-gray-800 hover:bg-gray-700 text-white rounded px-4 py-2"  onClick={() => infoChange(book)}>詳細情報</button></td>
                                )
                              }
                              <td><button class="bg-red-800 hover:bg-red-700 text-white rounded px-4 py-2"  onClick={() => deleteHandler(book.document_id)}>削除する</button></td>
                            </tr>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </tbody>
                  )}
                </Droppable>
              </DragDropContext>
            </table>
          </div>
        </div>
    );

};

export default Views;