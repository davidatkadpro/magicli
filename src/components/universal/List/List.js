import React from 'react'


export const List = ({
    children

}) => {
    return (
        <lu>
            {children.map((item, index) => (
                <li key={item.id || index}>

                </li>
            ))}
        </lu>
    )
}
