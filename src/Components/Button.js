import React from 'react'
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native'

export const Button = ({ title, backgroundColor, color, fontSize, borderRadius, onPress, padding, disabled }) => {
    const styles = StyleSheet.create({
        block: {
            backgroundColor: disabled ? '#bdbdbd' : backgroundColor ? backgroundColor : '#0277bd',
            borderRadius: borderRadius ? borderRadius : 5,
            padding: padding ? padding : 10
        },
        text: {
            color: disabled ? '#757575' : color ? color : '#ffffff',
            fontSize: fontSize ? fontSize : 20,
        }
    })
    return (
        <TouchableOpacity disabled={disabled} onPress={onPress}>
            <View style={styles.block}>
                <Text style={styles.text}>{title}</Text>
            </View>
        </TouchableOpacity>
    )
}



