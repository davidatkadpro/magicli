import React, {useContext} from 'react';
import styles from './ItemMode.module.css';
import { AppContext } from '../../context/AppContext';

export const ItemCount = ({item, title, remove, editable=false, showCount}) => {
    const active = item.modules && item.modules.count ? true : false;

    const { dispatch } = useContext(AppContext);

    const handleAdd = () => {
        item.modules.count.value = item.modules.count.value + 1
        updateItem()
    }
    const handleMinus = () => {
        item.modules.count.value = item.modules.count.value > 0 ? item.modules.count.value - 1 : 0;
        updateItem() 
    }
    const updateItem = () => {
        dispatch({
            type:'UPDATE_ITEM',
            payload: item
        });
    }
    const handleRemove = () => {
        delete item.modules.count
        dispatch({
            type:'UPDATE_ITEM',
            payload: item
        });
        showCount(false)
    }
    return (
        <>
            { active &&
            <div className={`${editable ? styles.modeMain : ''} ${styles.modeContainer}`}>
                {title && <h5>Count</h5>}
                <span className={styles.modeWrap}>
                    <i onClick={handleMinus} className={`material-icons ${styles.iconCount}`}>remove</i>
                    <span className={styles.countValue}>{item.modules.count.value}</span>
                    <i onClick={handleAdd} className={`material-icons ${styles.iconCount}`}>add</i>
                </span>
                {remove && <i onClick={handleRemove} className={`material-icons ${styles.iconClose}`}>close</i>}
            </div>}
        </>
    )
}
