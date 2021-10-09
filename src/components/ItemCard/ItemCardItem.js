import React, {useState, useContext} from 'react';
import styles from './ItemCard.module.css';
import { Link } from 'react-router-dom';
import { useClickOutside} from '../Helpers/ClickOutside';
import { AppContext } from '../../context/AppContext';


export default function ItemCardItem({item, maxIndex}) {
    const [itemMenu, setItemMenu] = useState(false);
    const [moveMenu, setMoveMenu] = useState(null)

    const [itemInput, setItemInput] = useState(item)

    const { items, children, dispatch } = useContext(AppContext);

    const nextId = () => items.reduce((id, item)=>( item.id > id ? item.id : id), 0) + 1

    const handleChange = (e) => {
        const [name, value] = [e.target.name, e.target.value]
        setItemInput(prev => {
            return { ...prev, [name]:value }
        })
    }

    const handleTitleSave = (e) => { if (e.charCode === 13) handleUpdate() }

    const handleUpdate = () => {
        if (! itemInput.title || /^\s*$/.test(itemInput.title)) return

        dispatch({
            type:'UPDATE_ITEM',
            payload: itemInput
        });
        setItemMenu(false)
    }

    const handleCopy = () =>{
        let copy =  JSON.parse(JSON.stringify(item));
        copy.id = nextId()
        copy.index = maxIndex
        copy.title = item.title + ' - copy'
        dispatch({
            type:'ADD_ITEM',
            payload: copy
        });
        setItemMenu(false)
    }

    const handleMoveMenu = () => {
        const availible = [...items].filter(i => item.id !== i.id && item.parent !== i.id && ! children(item).includes(i))
        setMoveMenu(availible)
    }

    const handleMove = (e) => {
        const key = Number(e.target.dataset.key)        
        const copy = {...item}        
        copy.parent = key > 0 ? key : null;
        copy.index = items.filter(i => copy.parent === i.parent).length
        console.log('index',copy.index)
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
        <>  
            {itemMenu &&
            <div ref={domMenu}>
                <div onClick={() => setItemMenu(false)} className={styles.underlay}></div>
                <div className={`${styles.editWrap}`}>
                    <input
                        type="text"
                        placeholder="Title"
                        value={itemInput.title}
                        name='title'
                        className={`z-depth-5 ${styles.editInput}`}
                        onChange={handleChange} 
                        onKeyPress={handleTitleSave}
                    />
                    <button onClick={handleUpdate} className="btn secondary">Save</button>
                </div>
                <div className={`z-depth-5 ${styles.menuWrap}`}>
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
            </div>}
      

            <h6 className={styles.heading}><Link to={`/item/${item.id}`} as={`/item/${item.id}`}>{item.title}</Link></h6>
            <i onClick={()=>setItemMenu(true)} className={`material-icons right ${styles.iconSmall}`}>edit</i>

        </>
    )
}
