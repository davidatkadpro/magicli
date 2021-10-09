import React, {useState,useContext} from 'react'

import styles from './ItemDetail.module.css';
import { Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { useClickOutside } from '../Helpers/ClickOutside';

import { ItemTotal } from '../ItemModes/ItemTotal';
import { ItemCount } from '../ItemModes/ItemCount';
import { ItemDate } from '../ItemModes/ItemDate';

export const ItemListItem = ({item}) => {
    const [checked, setChecked] = useState(item.status || false)
    const [itemMenu, setItemMenu] = useState(false)
    const [moveMenu, setMoveMenu] = useState(null)

    const { items, children, dispatch } = useContext(AppContext);
    const listItems = [...items].filter(i => i.parent === item.id)

    const nextId = () => items.reduce((id, i)=>( i.id > id ? i.id : id), 0) + 1

    const handleChecked = (e) => {
        const check = e.target.checked;
        const listItem = item;
        listItem.status = check;
        dispatch({
            type:'UPDATE_ITEM',
            payload: listItem
        });
        setChecked(!checked)
    }

    const handleCopy = () =>{
        let copy = JSON.parse(JSON.stringify(item));
        copy.id = nextId()
        copy.index = listItems.length
        copy.title = item.title + ' - copy'
        dispatch({
            type:'ADD_ITEM',
            payload: copy
        });
        setItemMenu(false)
    }

    const handleMoveMenu = () => {
        const availible = [...items].filter(i => item.id !== i.id && item.parent !== i.id  && ! children(item).includes(i))
        setMoveMenu(availible)
    }
    const handleMove = (e) => {
        const key = Number(e.target.dataset.key)        
        const copy = {...item}        
        copy.parent = key > 0 ? key : null;
        copy.index = items.filter(i => copy.parent === i.parent).length
        dispatch({
            type:'UPDATE_ITEM',
            payload: copy
        });
        setMoveMenu(null)
        setItemMenu(false)
    }

    const handleDelete = () => {
        dispatch({
            type:'DELETE_ITEM',
            payload: item
        });
        setItemMenu(false)
    }

    let domMenu = useClickOutside(() => {
        setItemMenu(false)
    })

    return (
        <div className={styles.warp}>
            {itemMenu && 
            <>
                <div onClick={() => setItemMenu(false)} className={styles.underlay}></div>
                <div ref={domMenu} className={`z-depth-5 ${styles.menuWrap}`}>
                    <ul>
                        <li><i onClick={() => setItemMenu(false)}className={`material-icons ${styles.icon}`}>close</i></li>
                        <li onClick={handleCopy}>Copy</li>
                        <li onClick={handleMoveMenu}>Move</li>
                        { moveMenu &&
                        <li className={styles.scrollList}>
                            <ul>
                                { item.parent && <li onClick={handleMove} data-key='0'>Dashboard</li>}
                                {moveMenu.map((i)=>(
                                <li onClick={handleMove} key={i.id} data-key={i.id}>{i.title}</li>
                                ))}
                            </ul>
                        </li>}
                        <li onClick={handleDelete}>Delete</li>
                    </ul>
                </div>
            </>}
            <div>
                <label className={styles.checkBox}><input type="checkbox" className="filled-in" checked={checked} onChange={handleChecked} /><span></span></label>
                <h6 className={styles.listItemHeading} style={checked ? {textDecoration:"line-through"} : {textDecoration:"none"}}><Link to={`/item/${item.id}`} as={`/item/${item.id}`}>{item.title}</Link></h6>
                <i onClick={()=>setItemMenu(true)}  className={`material-icons right ${styles.iconHidden}`}>edit</i>
                <ItemTotal item={item} />
                <ItemCount item={item} />
                <ItemDate  item={item} />            
            </div>
        </div>
    )
}
