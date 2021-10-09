import React, {useContext} from 'react'
import { AppContext } from '../context/AppContext';
import { TreeCrawl } from '../ItemTree/TreeCrawl';
import { Link, useHistory } from 'react-router-dom';

import styles from '../ItemTree/TreeCrawl.module.css';


export default function ListTree() {
    const { items } = useContext(AppContext);

    let history = useHistory();

    const build = () => {
        const added = []
        const crawl = (parent) => {
            const found = {}
            for ( var i in items) {
                var item = items[i];
                if (parent === item.parent && ! added.includes(item.id)) {
                    added.push(item.id);
                    found[item.id] = {title:item.title}
                    var children = crawl(item.id)
                    if (Object.keys(children).length > 0) {found[item.id].children = children}                
                } 
            }
            return found
        }
        return crawl(null)
    }
    const itemTree = build()


    return (
    <>
        <div className="container">

                    <ul className={`card-panel ${styles.card}`}>
                    <button className={`btn secondary right  ${styles.button}`} onClick={() => history.goBack()}>back</button>
                    {Object.keys(itemTree).map((key)=>{
                        var item = itemTree[key]
                        return (
                        <li className={styles.listli} key={key}>                    
                            <Link className={styles.listItems} to="/">{item.title}</Link>
                            {item.children &&
                            <TreeCrawl items={item.children} />
                            }                    
                        </li>)             
                    })}
                    </ul>

        </div></>
    )
}
