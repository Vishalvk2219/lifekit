import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermission() {
  try {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();

    if (existingStatus === 'granted') {
      return {
        granted: true,
        error: null,
      };
    }

    const { status } =
      await Notifications.requestPermissionsAsync();

    return {
      granted: status === 'granted',
      error: null,
    };
  } catch (error) {
    return {
      granted: false,
      error,
    };
  }
}

export async function scheduleReminderNotification({
  title,
  remindAt,
  repeatRule,
}) {
  const permission =
    await requestNotificationPermission();

  if (permission.error) {
    return {
      notificationId: null,
      error: permission.error,
    };
  }

  if (!permission.granted) {
    return {
      notificationId: null,
      error: new Error(
        'Notification permission was not granted.'
      ),
    };
  }

  const date = new Date(remindAt);

  if (Number.isNaN(date.getTime())) {
    return {
      notificationId: null,
      error: new Error('Invalid reminder date.'),
    };
  }

  let trigger;

  if (repeatRule === 'daily') {
    trigger = {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: date.getHours(),
      minute: date.getMinutes(),
    };
  } else if (repeatRule === 'weekly') {
    trigger = {
      type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
      weekday: date.getDay() + 1,
      hour: date.getHours(),
      minute: date.getMinutes(),
    };
  } else {
    trigger = {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date,
    };
  }

  try {
    const notificationId =
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'LifeKit Reminder',
          body: title,
          sound: 'default',
        },
        trigger,
      });

    return {
      notificationId,
      error: null,
    };
  } catch (error) {
    return {
      notificationId: null,
      error,
    };
  }
}

export async function cancelReminderNotification(
  notificationId
) {
  if (!notificationId) {
    return { error: null };
  }

  try {
    await Notifications.cancelScheduledNotificationAsync(
      notificationId
    );

    return { error: null };
  } catch (error) {
    return { error };
  }
}