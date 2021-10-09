import { createContext, useReducer, useEffect } from "react";

const AppReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_ITEM':
            return {
                ...state, 
                items: [...state.items, action.payload],
            }
        case 'UPDATE_ITEM':
            return {
                ...state, 
                items: state.items.map(
                    (item) => item.id === action.payload.id ? action.payload : item
                )
            }  
        case 'DELETE_ITEM':
            // TODO crap futher down and delete all child items, also add a warning dialog
            return {
                ...state, 
                items: [...state.items].filter(item => item.id !== action.payload.id && ! getChildren(action.payload, state.items).includes(item) )
            } 
        case 'UPDATE_ITEMS':
            return {
                ...state, 
                items: state.items.map((item) => {
                    action.payload.forEach(newItem => {
                        if (newItem.id === item.id){
                            return newItem;
                        }
                    })
                    return item;
                })
            }  
        case 'ADD_TAG':
            return {
                ...state, 
                tags: [...state.tags, action.payload],
            }
        case 'DELETE_TAG':
            return {
                ...state, 
                tags: [...state.tags].filter(tag => tag.id !== action.payload.id),
                items: [...state.items, state.items.map( (item) => {
                    if (item.tags && item.tags.includes(action.payload)) {
                        item.tags = item.tags.filter(tag => tag !== action.payload.id) }
                    return item
                })] 
            }        
        default:
            return state;
    }
}
const KEY = 'list-app';
const getStore = () =>{
    return  JSON.parse(localStorage.getItem(KEY));
}
const setStore = (data) =>{
    localStorage.setItem(KEY, JSON.stringify(data));
}

const getChildren = (item, items) => {
    const found = []
    const crawl = (id, items) =>{
        for(var i in items) {
            if (items[i].parent === id && ! found.includes(items[i]) ) {
                found.push(items[i]);
                crawl(items[i].id, items)
            } 
        }
    }
    crawl(item.id, items)
    return found
}

const initialState = {
    tags: [
        {id:1, title:'Personal'}
    ],
    items:[
        {id:1, title:'Title', description:'', tags:[], parent:null},
        {id:2, title:'Title 2', description:'', tags:[], parent:null},
        {id:3, title:'Title 3', description:'', tags:[], parent:2},
    ]
}


export const AppContext = createContext();

export const AppProvider = (props) =>{
    const [state, dispatch] = useReducer(AppReducer, getStore() || initialState);

    useEffect(() => {
        setStore(state)
    }, [state])

    return (
    <AppContext.Provider 
        value={{
            items: state.items,
            tags: state.tags,
            children: (item) => getChildren(item, state.items), 
            dispatch,
        }}
    >
        {props.children}
    </AppContext.Provider>)
}