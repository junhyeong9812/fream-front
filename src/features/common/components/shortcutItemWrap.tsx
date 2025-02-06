import '../css/shortcutItemWrap.css';
import React from 'react';
import ShortcutItem from './shortcutItem';
import { ShortcutItemWrapProps } from '../types/commonTypes';

const ShortcutItemWrap: React.FC<ShortcutItemWrapProps> = ({ shortcutList }) => {

  return (
    <div className='shortcut_item_wrap'>
      {shortcutList.map((item, index) => (
        <ShortcutItem shortcut={item} key={index}/>
      ))}
    </div>
  );
};
  
  export default ShortcutItemWrap;
  