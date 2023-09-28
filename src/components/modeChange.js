import Info from './info';
import MemoBase from './memoBase';
import List from './list';

const ModeChange = ({ mode }) => {

    switch (mode) {
        case 'info':
            return (
                <Info />                          
            );
        case 'memo':
            return (
                <MemoBase />
            );
        case 'list':
            return (
                <List />
            );
        default:
            return;
    }

};

export default ModeChange;