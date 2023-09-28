import DOMPurify from 'dompurify';
import { marked } from 'marked';
import '../style.css';

const Memo = ({ memo }) => {

    if (memo) {
        
        return (
            <>
              <div className='markdown'>
                <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(marked(memo.memo))}}></div>
              </div>
            </>
        );
        
    }

};

export default Memo;