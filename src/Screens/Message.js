import { Ionicons } from '@expo/vector-icons'
import { useNavigation, useTheme } from '@react-navigation/native'
import React, { useContext, useEffect, useState } from 'react'
import { TextInput, KeyboardAvoidingView, ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { AuthContext } from '../context/AuthContext'

const Message = ({ messages, setMessages, route: { params: { item } } }) => {
    const id = item._id
    const title = item.name
    const auth = useContext(AuthContext)
    const { setOptions } = useNavigation()
    const { message, colors } = useTheme()
    const [input, setInput] = useState('')
    const msgArr = messages.filter(msg => msg.room === id)

    useEffect(() => {
        setOptions({ title: title })
    }, [])

    const sendMessage = async () => {
        auth.socketRef.current.emit('message:send', { content: input, room: id, user: auth.userId })
        setMessages(messages => [...messages, { content: input, room: id, user: auth.userId }])
        setInput('')
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
            keyboardVerticalOffset={80}
        >
            <ScrollView>
                {msgArr.map((option, index) => {
                    if (option.user !== auth.userId) {
                        return (
                            <View key={index} style={message.in.container}>
                                <View style={message.in.block}>
                                    <Text style={message.in.text}>
                                        {option.content}
                                    </Text>
                                </View>
                            </View>
                        )
                    } else {
                        return (
                            <View key={index} style={message.out.container}>
                                <View style={message.out.block}>
                                    <Text style={message.out.text}>
                                        {option.content}
                                    </Text>
                                </View>
                            </View>
                        )
                    }
                })}
            </ScrollView>
            <View style={styles.footer}>
                <TextInput
                    value={input}
                    onChangeText={(text) => setInput(text)}
                    placeholder='Сообщение...'
                    style={styles.textInput}
                />
                <TouchableOpacity disabled={!input} onPress={sendMessage} activeOpacity={0.5}>
                    <Ionicons name='send' size={30} color={input ? colors.accept : '#ccc'} />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView >
    )
}

export default Message

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
        height: '100%'
    },
    textInput: {
        height: 40,
        marginRight: 15,
        backgroundColor: '#9e9e9e',
        padding: 10,
        flex: 1,
        color: '#0e0e0e',
        fontSize: 16,
        borderRadius: 30,
    },
    footer: {
        bottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: 10
    }
})
