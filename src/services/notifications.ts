/**
 * Notification service for countdown reminders and milestones
 * Timezone-aware and minimal
 */

import PushNotification from 'react-native-push-notification';
import { Platform } from 'react-native';
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
      onRegister: function (token) {
        console.log('Notification token:', token);
      },
      onNotification: function (notification) {
        console.log('Notification received:', notification);
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: Platform.OS === 'ios',
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
        (created) => console.log(`Channel created: ${created}`),
      );
    }

    this.initialized = true;
  }

  /**
   * Schedule daily countdown reminder
   */
  scheduleDailyReminder(countdown: Countdown): void {
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
    });
  }

  /**
   * Schedule milestone notifications
   */
  scheduleMilestones(countdown: Countdown): void {
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
        });
      }
    });
  }

  /**
   * Cancel all scheduled notifications
   */
  cancelAll(): void {
    PushNotification.cancelAllLocalNotifications();
  }

  /**
   * Request notification permissions
   */
  async requestPermissions(): Promise<boolean> {
    return new Promise((resolve) => {
      PushNotification.requestPermissions((permissions) => {
        const granted = permissions.alert === true;
        resolve(granted);
      });
    });
  }
}

export const notificationService = new NotificationService();

