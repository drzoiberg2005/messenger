import React, { useContext, useEffect } from 'react'
import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import { AuthContext } from '../context/AuthContext'
import { useNavigation, useTheme } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'

export const ListMessages = ({ messages, rooms, contactsCloud }) => {
    const auth = useContext(AuthContext)
    const { setOptions, navigate } = useNavigation()
    const { blockAccept, header, text, colors } = useTheme()

    useEffect(() => {
        if (rooms) {
            rooms.sort((a, b) => a.updated > b.updated)
        }
    }, [rooms])

    useEffect(() => {
        setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={() => navigate('ListContacts')}>
                    <Ionicons style={{
                        fontSize: 30,
                        color: colors.accept
                    }} name='add-outline' />
                </TouchableOpacity>
            )
        })
    }, [])

    const renderItem = ({ item }) => {
        let user
        if (contactsCloud.find(contact => contact.id === item.users.find(user => user !== auth.userId))) {
            user = contactsCloud.find(contact => contact.id === item.users.find(user => user !== auth.userId)).name
        } else {
            user = 'Неизвестный абонент'
        }
        const msgArr = messages.filter(msg => msg.room === item._id)
        const index = msgArr.length - 1

        return (
            <TouchableOpacity onPress={() => navigate('Message', { item: item })} >
                <View style={blockAccept} >
                    <Text style={header}>{user}</Text>
                    <Text style={text}>{msgArr.length > 0 ? msgArr[index].content : ''}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <FlatList
            data={rooms}
            renderItem={renderItem}
            keyExtractor={item => item._id}
        />
    )
}

