import { useNavigation, useTheme } from '@react-navigation/native'
import React, { useEffect } from 'react'
import { TouchableOpacity, Text, View, FlatList } from 'react-native'

export const List = ({ data, columns, component }) => {
    const { blockAccept, text } = useTheme()
    const { navigate } = useNavigation()
    useEffect(() => {
        if (data) {
            data.sort((a, b) => a[columns[0]] < b[columns[0]])
        }
    }, [data])

    const renderItem = ({ item }) => {
        return (
            <TouchableOpacity key={columns[0]} onPress={() => navigate(component, { item: item })} >
                <View style={blockAccept} >
                    {columns.map((name, index) => {
                        return (
                            <Text key={index} style={text}>{item[name]}</Text>
                        )
                    })}
                </View>
            </TouchableOpacity >
        )
    }
    return (
        <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={item => item[columns[0]]}
        />
    )
}


