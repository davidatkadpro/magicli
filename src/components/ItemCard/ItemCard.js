import React, {useState, useContext} from 'react';
import { AppContext } from '../../context/AppContext';
import styles from './ItemCard.module.css';
import ItemCardItem from './ItemCardItem';
import { useClickOutside } from '../Helpers/ClickOutside';
import { DragDropContext, Droppable, Draggable  } from 'react-beautiful-dnd';

export default function ItemCard({item, items}) {
    const [itemInput, setitemInput] = useState(item)
    const [itemMenu, setItemMenu] = useState(false)
    const [moveMenu, setMoveMenu] = useState(null)

    const [editTitle, setEditTitle] = useState(false)

    const [addChild, setAddChild] = useState(false)
    const [childInput, setChildInput] = useState({title:'', description:'', tags:[], parent:item.id})

    const { children, dispatch } = useContext(AppContext);

    const childItems = [...items].filter(i => item.id === i.parent)
    childItems.sort((a, b) => (a.index > b.index) ? 1 : -1)

    const nextId = () => items.reduce((id, item)=>( item.id > id ? item.id : id), 0) + 1

    const handleTitleSave = (e) => {
        if (e.charCode === 13) {
            if (! itemInput.title || /^\s*$/.test(itemInput.title)) return

            dispatch({
                type:'UPDATE_ITEM',
                payload: itemInput
            });
            setEditTitle(false)
        }
    }

    const handleChange = (e) => {
        const [name, value] = [e.target.name, e.target.value]
        setitemInput(prev => {
            return { ...prev, [name]:value }
        })
    }

    const handleChildChange = (e) => {
        const [name, value] = [e.target.name, e.target.value]
        setChildInput(prev => {
            return { ...prev, [name]:value }
        })
    }

    const handleDelete = () => {
        dispatch({
            type:'DELETE_ITEM',
            payload: item
        });
        setItemMenu(false)
    }   

    const handleChildSave = (e) => { if (e.charCode === 13) handleAddChild() }

    const handleAddChild = () => {
        if (addChild && childInput.title.length > 0) {
            if (! childInput.title || /^\s*$/.test(childInput.title)) return
            const child = childInput;
            child.id = nextId();
            child.index = childItems.length;
            dispatch({
                type:'ADD_ITEM',
                payload: child
            });
            setChildInput({title:'', description:'', tags:[], parent:item.id})
            setAddChild(false)

        } else {
            setAddChild(true)    
        }
        
    }

    const handleCopy = () =>{
        let copy =  JSON.parse(JSON.stringify(item));
        copy.id = nextId()
        copy.index = childItems.length;
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

    const handleDragEnd = (result) => {
        if (! result.destination) return 
        const _items = Array.from(childItems);
        const [reordered] = _items.splice(result.source.index, 1);
        _items.splice(result.destination.index, 0, reordered);
        _items.forEach((i, index) => i.index = index);      
        dispatch({
            type:'UPDATE_ITEMS',
            payload: _items
        });
    }

    let domTitle = useClickOutside(() => {
        setEditTitle(false)
    })
    let domMenu = useClickOutside(() => {
        setItemMenu(false)
    })
    return (
    <div className={styles.warp}>
        {itemMenu &&
        <div ref={domMenu} className={`z-depth-5 ${styles.menuWrap}`}>
            <ul>
                <li><i onClick={() => setItemMenu(false)} className={`material-icons ${styles.icon}`}>close</i></li>
                <li onClick={() => {handleAddChild(); setItemMenu(false) }}>Add</li>
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
        </div>}
        <div className={`card-panel ${styles.cardPanel}`}>
            <ul>
            {editTitle ? (
            <input ref={domTitle} type="text" value={itemInput.title} name='title' className={styles.inputSmall} onChange={handleChange} onKeyPress={handleTitleSave}/>
            ) : (
            <h5 onClick={() => setEditTitle(true)} className={styles.heading}>{item.title}</h5>)}
            <i onClick={() => setItemMenu(!itemMenu)} className={`material-icons right ${styles.icon}`}>more_horiz</i>
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="items">
                {(provided) => (
                <div 
                    className="items"
                    {...provided.droppableProps} 
                    ref={provided.innerRef} 
                >
                    {childItems.map((i, index) => (
                    <Draggable key={i.id} draggableId={'item_'+i.id} index={index}>
                        {(provided) => (
                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className={`card-panel ${styles.childItem } ${styles.warp}`} >
                                <ItemCardItem item={i} maxIndex={childItems.length} />
                            </div>                                
                        )}
                    </Draggable>
                    ))} 
                    {provided.placeholder} 
                </div>
                )} 
                </Droppable>              
            </DragDropContext>
            </ul>
            <div className={addChild ? 'active' : ''}>
                <div className={`collapsible-body card-panel ${styles.collapsibleBody}`} style={addChild ? {display:'block'}:{}}>
                    <input
                        type="text"
                        placeholder="Title"
                        value={childInput.title}
                        name='title'
                        className={styles.inputSmall}
                        onChange={handleChildChange}
                        onKeyPress={handleChildSave}
                    />
                </div>
                <button onClick={handleAddChild} className="btn secondary">{addChild ? 'Save item' : 'Add item'}</button>
                {addChild && <i onClick={() => setAddChild(false)} className={`material-icons right ${styles.iconClose}`}>close</i>}
            </div>
        </div>
    </div>
    )
}
