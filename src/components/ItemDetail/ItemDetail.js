import React, {useContext, useState} from 'react';
import { AppContext } from '../../context/AppContext';
import { DragDropContext, Droppable, Draggable  } from 'react-beautiful-dnd';
import { useClickOutside } from '../Helpers/ClickOutside';
import { useHistory } from 'react-router-dom';

import { ItemListItem } from './ItemListItem';
import { ItemCount } from '../ItemModes/ItemCount';
import { ItemDate } from '../ItemModes/ItemDate';
import { ItemTotal } from '../ItemModes/ItemTotal';

import styles from './ItemDetail.module.css';

export default function ItemDetail({itemId}) {

    const { items, dispatch } = useContext(AppContext);
    const item = [...items].find(item => item.id === itemId)

    const [textAreaHeight, setTextAreaHeight] = useState('14rem')

    const [itemChecked, setItemChecked] = useState(item.status || false)
    const [itemInput, setItemInput] = useState(item)
    const [itemTitle, setItemTitle] = useState(false)
    const [itemDescription, setItemDescription] = useState(false) 

    const listItems = [...items].filter(i => i.parent === item.id)
    listItems.sort((a, b) => (a.index > b.index) ? 1 : -1)

    const [listItemInput, setListItemInput] = useState({title:'', description:'', tags:[], parent:itemId})
    const [listItemAdd, setListItemAdd] = useState(false)

    const [itemDatesAdd, setItemDatesAdd] = useState(item.modules && item.modules.date ? true : false ) 
    const [itemCountAdd, setItemCountAdd] = useState(item.modules && item.modules.count ? true : false) 
    const [itemTotalAdd, setItemTotalAdd] = useState(item.modules && item.modules.total ? true : false) 


    let history = useHistory();

    const nextId = () => items.reduce((id, i)=>( i.id > id ? i.id : id), 0) + 1

    const handleChange = (e) => {
        const [name, value] = [e.target.name, e.target.value] 
        setItemInput(prev => {
            return { ...prev, [name]:value }
        })
        if (name === 'description') {
            setTextAreaHeight(e.target.scrollHeight > 168 ? e.target.scrollHeight + 'px' : "14rem" )
        }
    }    
    const handleTitleSave = (e) => { if (e.charCode === 13) handleTitle() } 
    const handleTitle = () => {
        if (! itemInput.title || /^\s*$/.test(itemInput.title)) return
        const i = itemInput
        dispatch({
            type:'UPDATE_ITEM',
            payload: i
        });
        setItemTitle(false)
    }

    const handleDescription = () => {
        const i = itemInput
        dispatch({
            type:'UPDATE_ITEM',
            payload: i
        });
        setItemDescription(false)
    }

    const handleChecked = (e) => {
        const check = e.target.checked;
        const listItem = item;
        listItem.status = check;
        dispatch({
            type:'UPDATE_ITEM',
            payload: listItem
        });
        setItemChecked(!itemChecked)
    }

    const handleAddTotal = () => {
        const i = itemInput
        i.modules ? i.modules.total = {value:0} : i.modules = {total:{value:0}}

        dispatch({
            type:'UPDATE_ITEM',
            payload: i
        });
        setItemTotalAdd(true)    
    }

    const handleAddTotalAll = () => {
        const li = listItems.map((i) => {
            if (i.modules) {
                i.modules.total = {value:0}
            } else {
                i.modules = {total:{value:0}}
            }
            return i
        })
        dispatch({
            type:'UPDATE_ITEMS',
            payload: li
        });
        setItemTotalAdd(true)    
    }

    const handleAddCountAll = () => {
        const li = listItems.map((i) => { if (i.modules) { i.modules.count = {value:0} } else { i.modules = {count:{value:0}} } return i })
        dispatch({
            type:'UPDATE_ITEMS',
            payload: li
        });
        setItemCountAdd(true)    
    }

    const handleAddCount = () => {
        const i = itemInput
        i.modules ? i.modules.count = {value:0} : i.modules = {count:{value:0}}
        dispatch({
            type:'UPDATE_ITEM',
            payload: i
        });
        setItemCountAdd(true)
    }

    const handleAddDateAll = () => {
        const li = listItems.map((i) => { if (i.modules) { i.modules.count = {date:null} } else { i.modules = {count:{value:null}} } return i })
        dispatch({
            type:'UPDATE_ITEMS',
            payload: li
        });
    }

    const handleAddDate = () => {
        const i = itemInput
        i.modules ? i.modules.date = {value:null} : i.modules = {date:{value:null}}

        dispatch({
            type:'UPDATE_ITEM',
            payload: i
        });
        setItemDatesAdd(true)
    }

    // List Related
    const handleDragEnd = (result) => {
        if (! result.destination) return 
        const _items = Array.from(listItems);
        const [reordered] = _items.splice(result.source.index, 1);
        _items.splice(result.destination.index, 0, reordered);
        _items.forEach((i, index) => i.index = index);      
        dispatch({
            type:'UPDATE_ITEMS',
            payload: _items
        });
    }

    const handleListItemChange = (e) => {
        const [name, value] = [e.target.name, e.target.value] 
        setListItemInput(prev => {
            return { ...prev, [name]:value }
        })
    }

    const handleListItemSave = (e) => { if (e.charCode === 13) handleListItemAdd() }

    const handleListItemAdd = () => {
        if (! listItemInput.title || /^\s*$/.test(listItemInput.title)) return
        const listItem = listItemInput;
        listItem.id = nextId();
        listItem.index = listItems.length;

        dispatch({
            type:'ADD_ITEM',
            payload: listItem
        });
        setListItemInput({title:'', description:'', tags:[], parent:item.id})
        setListItemAdd(false)
    }

    const progress = () => {
        const size = listItems.length;
        const checked = listItems.reduce((count, i) => ( i.status === true ? count + 1 : count), 0 )
        const total = ((checked / size) * 100) 
        return  isNaN(total) ? '0%' : total.toFixed(0) + '%'
    }

    let domTitle = useClickOutside(() => {
        setItemTitle(false)
    })
    let domDesc = useClickOutside(() => {
        setItemDescription(false)
    })
    return (
        <div className={`card-panel ${styles.detailCard}`}>
            <div className="row">
                <div className="col s12 m8">
                    { itemTitle ? (
                    <div ref={domTitle}>
                    <input
                        type="text"
                        placeholder="Title"
                        value={itemInput.title}
                        name='title'
                        className={styles.inputSmall}
                        onChange={handleChange}
                        onKeyPress={handleTitleSave}
                    />
                    <button onClick={handleTitle} className="btn secondary">Save</button>
                    <i onClick={() => setItemTitle(false)} className={`material-icons right ${styles.iconClose}`}>close</i>
                    </div>) : (
                    <div>
                        <label className={styles.checkBox}><input type="checkbox" className="filled-in" checked={itemChecked} onChange={handleChecked} /><span></span></label>
                        <h5 onClick={() => setItemTitle(true)} className={styles.heading}>{item.title}</h5>
                        <button className='btn secondary right' onClick={() => history.goBack()}>back</button>
                    </div>)}                    
                    { itemDescription ? (
                    <div ref={domDesc}>
                    <textarea
                        type="text"
                        style={{height:textAreaHeight}}
                        className={`materialize-textarea card-panel ${styles.textArea}`}
                        placeholder="Description"
                        value={itemInput.description}
                        name='description'
                        onChange={handleChange}
                    ></textarea>
                    <button onClick={handleDescription} className="btn secondary">Save</button>
                    <i onClick={() => setItemDescription(false)} className={`material-icons right ${styles.iconClose}`}>close</i>
                    </div>) : (
                    <span onClick={() => setItemDescription(true)} className={`card-panel ${styles.description}`}>{item.description || '...'}</span>
                    )}
                    <ItemDate  item={item} title={true} remove={true} editable={true} showDate={setItemDatesAdd}/>
                    <ItemCount item={item} title={true} remove={true} editable={true} showCount={setItemCountAdd}/>
                    <ItemTotal item={item} listItems={listItems} title={true} remove={true} editable={true} showTotal={setItemTotalAdd}/>
                    <div className={styles.listWrap}>
                        
                        <h5 className={styles.heading}>Checklist</h5>
                        <span className={`right ${styles.progressPerc}`}>{progress()}</span>
                        <div className={styles.progressBar}><div style={{width:progress()}}></div></div>                        
                        <DragDropContext onDragEnd={handleDragEnd}>
                        <Droppable droppableId="items">
                        {(provided) => (
                        <ul 
                            className="items"
                            {...provided.droppableProps} 
                            ref={provided.innerRef} 
                        >   
                            { listItems.map((i, index) => (
                            <Draggable key={i.id} draggableId={'item_'+i.id} index={index}>
                                {(provided) => (
                                    <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className={`card-panel ${styles.childItem } ${styles.warp}`} >
                                        <ItemListItem item={i} />
                                    </li>                                
                                )}
                            </Draggable>
                            ))} 
                            {provided.placeholder} 
                        </ul>
                        )} 
                        </Droppable>              
                        </DragDropContext>
                    </div>
                    { listItemAdd ? (<>
                    <input
                        type="text"
                        placeholder="Title"
                        value={listItemInput.title}
                        name='title'
                        className={styles.inputSmall}
                        onChange={handleListItemChange}
                        onKeyPress={handleListItemSave}
                    />  
                    <button onClick={handleListItemAdd} className="btn secondary">Save</button>
                    <i onClick={()=>setListItemAdd(false)} className={`material-icons right ${styles.iconClose}`}>close</i>
                    </>) : (
                    <button onClick={()=>setListItemAdd(true)} className="btn secondary">Add item</button>
                    )}
                </div>
                <div className="col s12 m4">
                    <ul className={styles.itemNav}>
                        <li><h5 className={styles.heading}>Modes</h5></li>
                        { ! itemCountAdd && <li><button onClick={handleAddCount} className="btn minor">Add Card Count</button></li>}
                        <li><button onClick={handleAddCountAll} className="btn minor">Add Checklist Counts</button></li>
                        { ! itemDatesAdd && <li><button onClick={handleAddDate} className="btn minor">Add Card Date</button></li>}
                        <li><button onClick={handleAddDateAll} className="btn minor">Add Checklist Dates</button></li>
                        { ! itemTotalAdd && <li><button onClick={handleAddTotal} className="btn minor">Add Card Total</button></li>}
                        <li><button onClick={handleAddTotalAll} className="btn minor">Add Checklist Totals</button></li>
                        
                    </ul>
                </div>
            </div>

        </div>
    )
}
