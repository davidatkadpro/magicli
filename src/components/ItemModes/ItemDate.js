import React, {useContext} from 'react';
import styles from './ItemMode.module.css';
import { AppContext } from '../../context/AppContext';

export const ItemDate = ({item, title, remove, editable, showDate}) => {
    const active = item.modules && item.modules.date ? true : false;

    const { dispatch } = useContext(AppContext);

    const handleChange = (e) => {
        item.modules.date.value = e.target.value;
        updateItem() 
    }

    const updateItem = () => {
        dispatch({
            type:'UPDATE_ITEM',
            payload: item
        });
    }
    
    const handleRemove = () => {
        delete item.modules.date
        dispatch({
            type:'UPDATE_ITEM',
            payload: item
        });
        showDate(false)
    }
    return (
        <>
            { active &&
            <div className={`${editable ? styles.modeMain : ''} ${styles.modeContainer}`}>
                {title && <h5>Dates</h5>}
                <span className={styles.dateWrap}>
                    { editable ? (
                        <input className={styles.modeInput} type="datetime-local" name="date" value={item.modules.date.value} onChange={handleChange} />
                    ) : (
                        <span>{item.modules.date.value ? item.modules.date.value.replace("T"," ") : ""}</span>     
                    )}  
                                 
                </span>
                {remove && <i onClick={handleRemove} className={`material-icons ${styles.iconClose}`}>close</i>}
            </div>}
        </>
    )
}
