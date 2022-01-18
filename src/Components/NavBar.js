import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { useNavigation, useTheme } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'

export const NavBar = () => {
    const { colors } = useTheme()
    const { navigate } = useNavigation()
    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            backgroundColor: colors.card
        },
        icon: {
            fontSize: 30,
            color: colors.text,
            padding: 30
        }
    })

    const goTo = (screen) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
        navigate(screen)
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => goTo('ListMessages')}>
                <Ionicons style={styles.icon} name='chatbubbles-outline' />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => goTo('ListContacts')}>
                <Ionicons style={styles.icon} name='people-outline' />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => goTo('Settings')}>
                <Ionicons style={styles.icon} name='settings-outline' />
            </TouchableOpacity>
        </View>
    )
}


