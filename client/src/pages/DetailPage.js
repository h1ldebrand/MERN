import React, { useEffect, useCallback, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { useHttp } from '../hooks/http.hook'
import { AuthContext } from '../context/AuthContext'
import { Loader } from '../component/Loader'
import { LinkCard } from '../component/LinkCard'

export const DetailPage = props => {
    const { token } = useContext(AuthContext)
    const { request, loading } = useHttp()
    const [link, setLink] = useState(null)
    const linkId = useParams().id

    const getLink = useCallback(async () => {
        try {
            const fetched = await request(`/api/link/${linkId}`, 'GET', null, {
                Authorization: `Bearer ${token}`
            })
            setLink(fetched)
        } catch (error) {
            console.error(error)
        }
    }, [token, linkId, request])

    useEffect(() => {
        getLink()
    }, [getLink])

    if(loading){
        return <Loader/>
    }

    return(
        <>
            { !loading && link && <LinkCard link={link} /> }
        </>
    ) 
}