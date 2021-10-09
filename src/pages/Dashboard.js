import React, {useContext, useState} from 'react';
import ItemCard from '../components/ItemCard/ItemCard';
import { AppContext } from '../context/AppContext';
import styles from '../components/ItemCard/ItemCard.module.css';

export default function Dashboard() {
    const [formInput, setFormInput] = useState({title:'', description:'', tags:[], parent:null})
    const [addCard, setAddCard] = useState(false)

    const { items, dispatch } = useContext(AppContext);
    const baseItems = [...items].filter(item => ! item.parent)

    const handleChange = (e) => {
        setFormInput(prev => {
            return { ...prev, [e.target.name]:e.target.value }
        })  
    }
    const nextId = () => items.reduce((id, item)=>( item.id > id ? item.id : id), 0) + 1

    const handleSaveCard = (e) => { if (e.charCode === 13) handleAddCard(e) }

    const handleAddCard = (e) => {
        e.preventDefault();
        if (! formInput.title || /^\s*$/.test(formInput.title)) return

        const item = formInput;
        item.id = nextId();
        item.index = baseItems.length

        dispatch({
            type:'ADD_ITEM',
            payload: item
        });
        setFormInput({title:'', description:'', tags:[], parent:null})
        setAddCard(false)   
    }
    
    return (
        <>
            <div className="container">
                <div className={`row ${styles.rows}`}>
                    {baseItems.map((item) => ( 
                    <div key={item.id} className={`col s12 m6 l4 ${styles.cols}`}>
                        <ItemCard item={item} items={items} />
                    </div>))}
                    <div className={`col s12 m6 l4 ${styles.cols}`}>
                        <div className={`card-panel ${styles.cardPanel}`}>
                            {addCard &&
                            <div className={`collapsible-body card-panel ${styles.collapsibleBody}`} style={{display:'block'}}>
                                <input
                                    type="text"
                                    placeholder="Title"
                                    className={styles.inputSmall}
                                    value={formInput.title}
                                    name='title'
                                    onChange={handleChange}
                                    onKeyPress={handleSaveCard}
                                />
                            </div>}                                
                            {addCard ? (<>
                            <button onClick={handleAddCard} className="btn">Add</button>
                            <i onClick={() => setAddCard(false)} className={`material-icons right ${styles.iconClose}`}>close</i>
                            </>) : ( <>
                            <h6 onClick={()=>setAddCard(true)} className="title" style={{display:'inline-block',cursor:'pointer'}}>Add new card</h6>
                            <i onClick={()=>setAddCard(true)} className="material-icons right" style={{cursor:'pointer'}}>add</i>
                            </>)} 
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
