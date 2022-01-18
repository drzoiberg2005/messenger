import { useTheme } from '@react-navigation/native'
import React, { useContext } from 'react'
import { Text, View } from 'react-native'
import { SafeAreaInsetsContext } from 'react-native-safe-area-context'
import { Button } from '../Components/Button'
import { AuthContext } from '../context/AuthContext'

export const Settings = () => {
    const auth = useContext(AuthContext)
    const { blockInfo, text, header, button } = useTheme()

    return (<>
        <View style={blockInfo}>
            <Text style={header}>ID Пользователя:</Text>
            <Text style={text}>{auth.userId}</Text>
        </View>
        <View style={blockInfo}>
            <Text style={header}>Токен:</Text>
            <Text style={text}>{auth.token}</Text>
        </View>
        <View style={button}>
            <Button title='Выйти из профиля' backgroundColor='#d32f2f' onPress={() => auth.logout()} />
        </View>
    </>
    )
}
