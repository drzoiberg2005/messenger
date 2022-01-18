import React from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'

export const SplashScreen = () => {
    return (
        <View style={styles.container}>
            <ActivityIndicator size='large' color="#ffffff" />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#01579b',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    }
})
