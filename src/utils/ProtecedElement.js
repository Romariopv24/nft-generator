import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

function ProtectedElement({ children, role }) {
    const navigate = useNavigate()
    const shouldRenderChildren = role === "2"
  
    useEffect(() => {
      if (!shouldRenderChildren) {
        navigate('/')
      }
    }, [shouldRenderChildren, navigate])
  
    return shouldRenderChildren ? children : null
  }
  
  export default ProtectedElement
  