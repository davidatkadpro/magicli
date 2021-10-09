import React, {useContext} from 'react';
import styles from './ItemMode.module.css';
import { AppContext } from '../../context/AppContext';

export const ItemTotal = ({item, listItems, title, remove, editable, showTotal}) => {
    const active = item.modules && item.modules.total ? true : false;

    const { dispatch } = useContext(AppContext);

    const handleChange = (e) => {
        item.modules.total.value = Number(e.target.value);
        updateItem() 
    }

    const childTotals = () => {
        const totals =  listItems.reduce((count, i) => ( ( i.modules && i.modules.total && i.modules.total.value > 0) ? count + i.modules.total.value : count), 0 )
        return totals.toFixed(2);
    }

    const updateItem = () => {
        dispatch({
            type:'UPDATE_ITEM',
            payload: item
        });
    }
    const handleRemove = () => {
        delete item.modules.total
        dispatch({
            type:'UPDATE_ITEM',
            payload: item
        });
        showTotal(false)
    }
    return (
        <>
            { active &&
            <div className={`${editable ? styles.modeMain : ''} ${styles.modeContainer}`}>
                
                { editable &&
                <span className={styles.totalWrap}>
                    {title && <h5>Total</h5>}
                    <input className={styles.modeInput} type="text" name="total" value={item.modules.total.value} onChange={handleChange} />    
                </span>}                
                <span className={styles.totalWrap}>
                    {title && <h6 className={styles.headingChecklist}>Checklist</h6>}
                    { listItems ? (
                        <span className={styles.listTotals}>{childTotals()}</span>   
                    ):(
                        <span className={styles.listTotals}>{item.modules.total.value.toFixed(2)}</span>
                    )}                                     
                </span>
                {remove && <i onClick={handleRemove} className={`material-icons ${styles.iconClose}`}>close</i>}
            </div>}
        </>
    )
}
