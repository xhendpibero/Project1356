/**
 * Notification service for countdown reminders and milestones
 * Timezone-aware and minimal
 */

import PushNotification from 'react-native-push-notification';
import { Platform, PermissionsAndroid } from 'react-native';
import { Countdown } from '../types';
import { countdownService } from './countdown';

class NotificationService {
  private initialized = false;

  /**
   * Initialize notification service
   */
  initialize(): void {
    if (this.initialized) return;

    PushNotification.configure({
      onRegister: function (token: any) {
        console.log('Notification token:', token);
      },
      onNotification: function (notification: any) {
        console.log('Notification received:', notification);
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: false, // Don't auto-request to avoid Firebase dependency
    });

    // Create notification channel for Android
    if (Platform.OS === 'android') {
      PushNotification.createChannel(
        {
          channelId: 'project1356-countdown',
          channelName: 'Countdown Reminders',
          channelDescription: 'Daily countdown reminders and milestone alerts',
          playSound: true,
          soundName: 'default',
          importance: 4,
          vibrate: true,
        },
        (created: boolean) => console.log(`Channel created: ${created}`),
      );
    }

    this.initialized = true;
  }

  /**
   * Schedule daily countdown reminder
   */
  scheduleDailyReminder(countdown: Countdown): void {
    try {
      const remainingDays = countdownService.getRemainingDays(countdown);
      
      PushNotification.localNotificationSchedule({
        channelId: 'project1356-countdown',
        title: 'Project 1356',
        message: `Day ${remainingDays} of your countdown remains.`,
        date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow at same time
        repeatType: 'day',
        userInfo: {
          type: 'daily_reminder',
          screen: 'Countdown',
        },
        // Use inexact alarm as fallback if exact alarm permission not granted
        allowWhileIdle: true,
      });
    } catch (error) {
      console.error('Failed to schedule daily reminder:', error);
      // Try with inexact alarm
      try {
        const remainingDays = countdownService.getRemainingDays(countdown);
        PushNotification.localNotificationSchedule({
          channelId: 'project1356-countdown',
          title: 'Project 1356',
          message: `Day ${remainingDays} of your countdown remains.`,
          date: new Date(Date.now() + 24 * 60 * 60 * 1000),
          repeatType: 'day',
          userInfo: {
            type: 'daily_reminder',
            screen: 'Countdown',
          },
        });
      } catch (fallbackError) {
        console.error('Failed to schedule reminder with fallback:', fallbackError);
      }
    }
  }

  /**
   * Schedule milestone notifications
   */
  scheduleMilestones(countdown: Countdown): void {
    try {
      const milestones = [1000, 500, 100, 30, 7, 1];
      const remainingDays = countdownService.getRemainingDays(countdown);

      milestones.forEach((milestone) => {
        if (remainingDays >= milestone) {
          const daysUntilMilestone = remainingDays - milestone;
          const notificationDate = new Date(Date.now() + daysUntilMilestone * 24 * 60 * 60 * 1000);

          PushNotification.localNotificationSchedule({
            channelId: 'project1356-countdown',
            title: 'Milestone',
            message: `${milestone} days remaining in your countdown.`,
            date: notificationDate,
            userInfo: {
              type: 'milestone',
              milestone,
              screen: 'Countdown',
            },
            allowWhileIdle: true,
          });
        }
      });
    } catch (error) {
      console.error('Failed to schedule milestones:', error);
      // Continue - some notifications may still work
    }
  }

  /**
   * Cancel all scheduled notifications
   */
  cancelAll(): void {
    PushNotification.cancelAllLocalNotifications();
  }

  /**
   * Request notification permissions
   * Uses native APIs to avoid Firebase dependency
   */
  async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'android') {
      // For Android 13+ (API 33+), use PermissionsAndroid
      if (Platform.Version >= 33) {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
            {
              title: 'Notification Permission',
              message: 'Project 1356 needs notification permission to send countdown reminders.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (error) {
          console.error('Failed to request Android permissions:', error);
          return false;
        }
      } else {
        // For Android < 13, notifications are granted by default
        return true;
      }
    } else {
      // For iOS, use the library's method (doesn't require Firebase)
      try {
        return new Promise((resolve) => {
          PushNotification.requestPermissions((permissions: any) => {
            const granted = permissions.alert === true;
            resolve(granted);
          });
        });
      } catch (error) {
        console.error('Failed to request iOS permissions:', error);
        return false;
      }
    }
  }
}

export const notificationService = new NotificationService();

