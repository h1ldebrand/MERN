import React, { useEffect, useState, useContext } from 'react'
import { useHttp } from '../hooks/http.hook'
import { AuthContext } from '../context/AuthContext'
import { useHistory } from 'react-router-dom'

export const CreatePage = props => {
    const history = useHistory()
    const auth = useContext(AuthContext)
    const { request } = useHttp()
    const [link, setLink] = useState('')

    useEffect(() => {
        window.M.updateTextFields()
    }, [])

    const pressHandler = async event => {
        if(event.key === 'Enter'){
            try {
                const data = await request('/api/link/generate', 'POST', {from: link}, {
                    Authorization: `Bearer: ${auth.token}`
                })
                history.push(`/detail/${data.link._id}`)
            } catch (error) {}
        }
    }

    return(
        <div className="create-page row">
            <div className="create-page__content col s8 offset-s2" >
                <div className="input-field">
                    <input
                        placeholder="Insert link"
                        type="text"
                        id="link"
                        className="yellow-input"
                        name="link"
                        value={link}
                        onChange={e => setLink(e.target.value)}
                        onKeyPress={pressHandler}
                    />
                    <label htmlFor="link">Enter link</label>
                </div>
            </div>
        </div>
    ) 
}