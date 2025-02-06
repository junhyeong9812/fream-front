import '../css/shortcutItem.css';
import React from 'react';
import { ShortcutItemProps } from '../types/commonTypes';

const ShortcutItem: React.FC<ShortcutItemProps> = ({ shortcut }) => {

    return(
        <div className='shortcut_item_container'>
            <img className='shortcut_item_img' src={shortcut.img}></img>
            <p className='shortcut_item_text'>{shortcut.name}</p>
        </div>
    )
}

export default ShortcutItem;