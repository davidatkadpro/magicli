import React, {useContext} from 'react';
import { AppContext } from '../../../context/AppContext';
import { Link } from 'react-router-dom';
export default function NavLinks() {
    const { items } = useContext(AppContext);
    const baseItems = [...items].filter(item => ! item.parent)
    const menuItems = baseItems.map((item)=> ({href:'/item/'+item.id,title:item.title}) )

    return (                    
        menuItems.map((item, index)=>(
            <li key={index}><Link to={item.href}>{item.title}</Link></li>
        )));
}
