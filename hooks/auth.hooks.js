import { useState, useCallback, useEffect } from 'react'
import * as SecureStore from 'expo-secure-store'
import { Platform } from 'react-native'

export const useAuth = () => {
    const storageName = 'userData'
    const [token, setToken] = useState(null)
    const [userId, setUserId] = useState(null)
    const [ready, setReady] = useState(false)
  
    const login = useCallback((jwtToken, id) => {
        setToken(jwtToken)
        setUserId(id)
        const storeData = async () => {
            try {
                await SecureStore.setItemAsync('userId', id)
                await SecureStore.setItemAsync('token', jwtToken)
            } catch (e) {
                console.log(e)
            }
        }

        if (Platform.OS == 'web') {
            localStorage.setItem(storageName, JSON.stringify({ userId: id, token: jwtToken, userGroup: userGroup }))
        } else {
            storeData()
        }
    }, [])


    const logout = useCallback(() => {
        setToken(null)
        setUserId(null)

        const removeData = async () => {
            try {
                await SecureStore.deleteItemAsync('userId')
                await SecureStore.deleteItemAsync('token')
            } catch (e) {
                console.log(e)
            }
        }
        if (Platform.OS == 'web') {
            localStorage.removeItem(storageName, JSON.stringify({ userId: id, token: jwtToken, userGroup: userGroup }))
        } else {
            removeData()
        }
        setReady(false)
    }, [])

    useEffect(async () => {
        if (Platform.OS == 'web') {
            const data = await JSON.parse(localStorage.getItem(storageName))
            if (data && data.token) {
                console.log('HERE')
                setReady(true)
                login(data.token, data.userId, data.userGroup)
            }
        } else {
            setToken(await SecureStore.getItemAsync('token'))
            setUserId(await SecureStore.getItemAsync('userId'))
            if (userId && token) {
                setReady(true)
                login(token, userId)
            }
        }

    }, [login])


    return { login, logout, token, userId, ready }
}