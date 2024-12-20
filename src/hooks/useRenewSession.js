import React, { useRef } from 'react'
import { useNavigate } from 'react-router-dom'

export const useRenewSession = () => {

  const currentToken = localStorage.getItem('NFansT Token')
  const renewalInProgressRef = useRef(false)

  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('NFansT Token')
    navigate('/login')
  }

  const headers = {
    baseURL: "https://api-nfanst-final.devtop.online/api/v1",
    responseType: "json",
    timeout: 300000,
    headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Access-Control-Allow-Origin": true,
        Pragma: "no-cache",
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentToken}` 
      }
}


    const renewToken = async () => {
        try {
            renewalInProgressRef.current = true

            if(!currentToken) return

            const updateHeaders = {
                ...headers,
                Authorization: `Bearer ${currentToken}`
            }

        } catch (error) {
            
        }
    }

}
