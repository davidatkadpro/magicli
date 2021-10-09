import React from 'react';
import { useParams } from 'react-router';
import ItemDetail from '../components/ItemDetail/ItemDetail';

export default function Item({ match }) {
    let { itemId } = useParams();
    const id = Number(itemId) || null;
    
    return (
        <div className="container">
            <ItemDetail key={id} itemId={id} />
        </div>
    )
}
