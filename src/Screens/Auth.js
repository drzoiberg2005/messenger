import React, { useState, useContext, useEffect } from 'react'
import { Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native'
import { SplashScreen } from '../Components/SplashScreen'
import { AuthContext } from '../context/AuthContext'
import { useHttp } from '../../hooks/http.hook'
import { Button } from '../Components/Button'

export const Auth = (expoPushToken) => {
    const [telephone, setTelephone] = useState('')
    const [time, setTime] = useState(0)
    const [code, setCode] = useState('')
    const [color, setColor] = useState('#00e676')
    const auth = useContext(AuthContext)
    const { loading, request, error, clearError } = useHttp()
    const [message, setMessage] = useState('')
    const [send, setSend] = useState(false)

    useEffect(() => {
        clearError()
    }, [error, clearError])

    const registerHandler = async () => {
        try {
            const user = await request('/api/user/generate', 'POST', { telephone })
            setTime(30)
            setMessage(user.message)
            setSend(user.status)
            setColor('#00e676')
        } catch (e) {
            setMessage(e.message)
            setColor('#ff3d00')
        }
    }
    const loginHandler = async () => {
        try {
            const data = await request('/api/auth/login', 'POST', { telephone, code })
            if (data.token && data.userId) {

                auth.login(data.token, data.userId)
            }
        } catch (e) {
            setMessage(e.message)
            setColor('#ff3d00')
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            setTime(time - 1)
        }, 1000)
        return () => clearTimeout(timer)
    }, [time])

    const RetrySend = () => {
        setSend(false)
        setMessage()
        setTime(30)
    }

    if (loading) {
        return <SplashScreen />
    }


    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.inner}>
                    <Text style={styles.header}>WARDER</Text>
                    <Text style={styles.header}>Авторизация</Text>
                    <View style={styles.block}>
                        {!send ?
                            <>
                                <Text style={styles.text}>+7</Text>
                                <TextInput
                                    style={styles.input}
                                    maxLength={10}
                                    placeholder='(***)***-**-**'
                                    keyboardType='numeric'
                                    value={telephone}
                                    textContentType='telephoneNumber'
                                    onChangeText={setTelephone}
                                />
                                <Button title='Отправить' fontSize={15} backgroundColor='#00796b' onPress={() => registerHandler()} />
                            </>
                            :
                            <>
                                <Text style={styles.text}>Код:</Text>
                                <TextInput
                                    style={{ ...styles.input, ...{ width: '27%' } }}
                                    keyboardType='numeric'
                                    maxLength={5}
                                    value={code}
                                    textContentType='oneTimeCode'
                                    onChangeText={setCode}
                                />
                                <Button title='Подтвердить' fontSize={15} backgroundColor='#00796b' onPress={() => loginHandler()} />
                            </>
                        }
                    </View>
                    <View style={styles.footer}>
                        {send ? <Button disabled={time > 0} title={time <= 0 ? 'Отправить код заново' : `Отправить код повторно можно через ${time}`} fontSize={15} onPress={() => RetrySend()} /> : null}
                        <Text style={{ ...styles.warning, ...{ color: color } }}>{message}</Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#01579b'
    },
    inner: {
        padding: 24,
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    block: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    text: {
        fontSize: 25,
        color: '#eeeeee'
    },
    warning: {
        fontSize: 20,
        padding: 20
    },
    input: {
        fontSize: 30,
        width: '50%',
        marginLeft: 15,
        marginRight: 15,
        borderColor: '#eeeeee',
        borderBottomWidth: 2,
        color: '#eeeeee'
    },
    header: {
        fontSize: 35,
        fontWeight: '400',
        padding: 20,
        color: '#eeeeee'
    },
    button: {
        backgroundColor: '#1de9b6',
        color: '#000000'
    },
    footer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
    }
})
