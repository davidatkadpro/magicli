import React from 'react'
import { Link } from 'react-router-dom';

import styles from './TreeCrawl.module.css';

export const TreeCrawl = ({items}) => {

    return (
        <>        
        <ul style={{marginLeft:'1rem'}}>
                                        
            {Object.keys(items).map((key, index)=>{                
                var item = items[key]
                return (
                <li className={styles.listli} key={key}>                    
                    <Link className={styles.listItems} to={`/item/${key}`}>{item.title}</Link>
                    <div className={styles.link2} />
                    <div className={styles.link} />    
                    {item.children && <>                                  
                    <TreeCrawl items={item.children} />
                    </>}                    
                </li>)             
            })}
        </ul>
        </>
    )
}
