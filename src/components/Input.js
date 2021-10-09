import React, {useState} from 'react'

export const Input = (name, init='', placeholder='', classes='', type='text') => {
    const [inputState, setInputState] = useState(init)

    const handleChange = (e) =>{
        setInputState(e.target.value)
    }

    const inputHtml = (
        <input
            type={type}
            placeholder={placeholder}
            value={inputState}
            name={name}
            className={classes}
            onChange={handleChange}
        />  
    )
    return [inputHtml, inputState, setInputState]
}
