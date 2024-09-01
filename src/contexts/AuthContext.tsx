import { QLI_API_ENDPOINTS } from '@app/services/qli/endpoints'
import axios from 'axios'
import { createContext, useEffect, useMemo, useState } from 'react'

const AuthContext = createContext({ isAuthorized: false })

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthorized, setIsAuthorized] = useState(false)

  const contextValue = useMemo(() => ({ isAuthorized }), [isAuthorized])

  const loginAsGuest = async () => {
    try {
      const response = await axios.post(QLI_API_ENDPOINTS.LOGIN, {
        userName: 'guest@qubic.li',
        password: 'guest13@Qubic.li',
        twoFactorCode: ''
      })
      localStorage.setItem('jwt_access_token', response.data.token)
      setIsAuthorized(true)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error during guest login:', error)
    }
  }

  const verifyToken = async (token: string) => {
    try {
      await axios.get(QLI_API_ENDPOINTS.TICK_OVERVIEW, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setIsAuthorized(true)
    } catch (error) {
      await loginAsGuest()
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('jwt_access_token')
    if (token) {
      verifyToken(token)
    } else {
      loginAsGuest()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
