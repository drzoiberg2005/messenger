import React, { useState, useEffect, useContext } from 'react'
import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import { AuthContext } from '../context/AuthContext'
import { useNavigation, useTheme } from '@react-navigation/native'

export const ListContacts = ({ loading, contactsTelephone, contactsCloud }) => {
    const auth = useContext(AuthContext)
    const { blockAccept, blockInfo, blockCancel, text } = useTheme()
    const { navigate } = useNavigation()
    const [find, setFind] = useState(false)

    useEffect(() => {
        if (contactsCloud) {
            contactsCloud.sort((a, b) => a.name < b.name)
        }
    }, [contactsCloud])

    useEffect(async () => {
        const listContacts = []
        if (contactsTelephone.length > 0 && !loading) {
            for (const contact of contactsTelephone) {
                if (contact.phoneNumbers !== undefined) {
                    for (const number of contact.phoneNumbers) {
                        const trim = number.digits.trim()
                        let format = trim
                        if (trim[0] == '8') {
                            format = number.digits.substr(1)
                        }
                        if (trim[0] == '+') {
                            format = number.digits.substr(2)
                        }
                        if (format.length === 10 && format[0] === '9') {
                            if (listContacts.indexOf(format) == - 1) {
                                listContacts.push({
                                    telId: contact.id,
                                    lastName: contact.lastName ? contact.lastName : null,
                                    firstName: contact.firstName ? contact.firstName : null,
                                    middleName: contact.middleName ? contact.middleName : null,
                                    name: contact.name,
                                    telephone: format,
                                })
                            }
                        }
                    }
                }
            }

            let arr = JSON.parse(JSON.stringify(contactsCloud))
            for (const key of arr) {
                delete key.id
            }

            let newContacts = []
            for (const item of listContacts) {
                let find = false
                for (const item2 of arr) {
                    if (JSON.stringify(item2) === JSON.stringify(item))
                        find = true
                }
                if (!find) {
                    newContacts.push(item)
                }
            }
            if (newContacts.length > 0) {
                auth.socketRef.current.emit('contacts', newContacts)
                setFind(true)
            }
        }
    }, [loading, contactsTelephone])

    const renderItem = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => navigate('Contact', { item: item })} >
                <View style={blockAccept} >
                    <Text style={text}>{item.name}</Text>
                </View>
            </TouchableOpacity >
        )
    }

    if (contactsCloud.length === 0) {
        return (
            <View style={find ? blockCancel : blockInfo}>
                <Text style={text}>{find ? 'Ищу контакты...' : 'Запрашиваю...'}</Text>
            </View>
        )
    }

    return (
        <FlatList
            data={contactsCloud}
            renderItem={renderItem}
            keyExtractor={item => item.id}
        />
    )
}