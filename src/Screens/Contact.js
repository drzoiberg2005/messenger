import { Ionicons } from '@expo/vector-icons'
import { useNavigation, useTheme } from '@react-navigation/native'
import React, { useContext, useEffect, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { AuthContext } from '../context/AuthContext'

const Contact = ({ rooms, route: { params: { item } } }) => {
    const { setOptions, navigate } = useNavigation()
    const [id, setId] = useState(null)
    const auth = useContext(AuthContext)
    const { blockInfo, text, header, colors } = useTheme()
    const [disabled, setDisabled] = useState(true)

    useEffect(() => {
        const find = rooms.find(room => room.users.indexOf(item.id) != -1)
        if (!find) {
            auth.socketRef.current.emit('room:create', { users: [auth.userId, item.id] })
        } else {
            setId(find._id)
        }
    }, [rooms])

    useEffect(() => {
        if (id !== null) {
            setDisabled(false)
        }
    }, [id])

    useEffect(() => {
        setOptions({
            title: item.name,
            headerRight: () => (
                <TouchableOpacity disabled={disabled} onPress={() => navigate('Message', { item: { name: item.name, _id: id } })}>
                    <Ionicons style={styles.icon} name='mail-open-outline' />
                </TouchableOpacity>
            )
        })
    }, [disabled])
    const styles = StyleSheet.create({
        icon: {
            fontSize: 30,
            color: !disabled ? colors.accept : '#cccccc'
        }
    })

    return (
        <View style={blockInfo}>
            {item['lastName'] ?
                <>
                    <Text style={header}>Фамилия:</Text>
                    <Text style={text}>{item['lastName']}</Text>
                </>
                : null}
            {item['firstName'] ?
                <>
                    <Text style={header}>Имя:</Text>
                    <Text style={text}>{item['firstName']}</Text>
                </>
                : null}
            {item['middleName'] ?
                <>
                    <Text style={header}>Отчество:</Text>
                    <Text style={text}>{item['middleName']}</Text>
                </>
                : null}
        </View>
    )
}

export default Contact


