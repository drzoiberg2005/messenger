import * as Notifications from 'expo-notifications'
import Constants from 'expo-constants'

export async function registerForPushNotificationsAsync() {
    let token
    if (Constants.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync()
        let finalStatus = existingStatus
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync()
            finalStatus = status
        }
        if (finalStatus !== 'granted') {
            alert('Пользователь отказался от получения PUSH уведомлений')
            return
        }
        token = (await Notifications.getExpoPushTokenAsync()).data
        console.log(token)
    } else {
        alert('PUSH уведомления работают только на физических устройствах')
    }

    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        })
    }

    return token
}