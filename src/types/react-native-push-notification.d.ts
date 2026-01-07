/**
 * Type declarations for react-native-push-notification
 */

declare module 'react-native-push-notification' {
  export interface PushNotificationPermissions {
    alert: boolean;
    badge: boolean;
    sound: boolean;
  }

  export interface PushNotificationOptions {
    channelId?: string;
    title?: string;
    message?: string;
    date?: Date;
    repeatType?: 'day' | 'week' | 'month' | 'year';
    userInfo?: any;
    allowWhileIdle?: boolean;
  }

  export interface PushNotificationConfig {
    onRegister?: (token: any) => void;
    onNotification?: (notification: any) => void;
    permissions?: PushNotificationPermissions;
    popInitialNotification?: boolean;
    requestPermissions?: boolean;
  }

  class PushNotification {
    configure(config: PushNotificationConfig): void;
    localNotificationSchedule(options: PushNotificationOptions): void;
    cancelAllLocalNotifications(): void;
    requestPermissions(callback: (permissions: PushNotificationPermissions) => void): void;
    createChannel(
      channelConfig: {
        channelId: string;
        channelName: string;
        channelDescription: string;
        playSound: boolean;
        soundName: string;
        importance: number;
        vibrate: boolean;
      },
      callback?: (created: boolean) => void
    ): void;
  }

  const PushNotificationInstance: PushNotification;
  export default PushNotificationInstance;
}

