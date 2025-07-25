import { User, Activity, ActivityType, AppSettings, ChatMessage } from '../types';
import { getWeekStart, getWeekId } from '../utils/dateUtils';

// Mock Data and Initial Setup
const initialActivityTypes: ActivityType[] = [
  { id: '1', name: 'Course à pied', icon: '🏃' },
  { id: '2', name: 'Vélo', icon: '🚴' },
  { id: '3', name: 'Musculation', icon: '🏋️' },
  { id: '4', name: 'Natation', icon: '🏊' },
  { id: '5', name: 'Yoga', icon: '🧘' },
];

const USERS_KEY = 'sportstracker_users';
const ACTIVITIES_KEY = 'sportstracker_activities';
const ACTIVITY_TYPES_KEY = 'sportstracker_activity_types';
const LOGGED_IN_USER_KEY = 'sportstracker_loggedin_user';
const PENALTY_CHECKS_KEY = 'sportstracker_penalty_checks';
const SETTINGS_KEY = 'sportstracker_settings';
const CHAT_MESSAGES_KEY = 'sportstracker_chat';


const getFromStorage = <T,>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage key “${key}”:`, error);
    return defaultValue;
  }
};

const setToStorage = (key: string, value: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to localStorage key “${key}”:`, error);
  }
};

export const initializeData = () => {
  if (!localStorage.getItem(USERS_KEY)) setToStorage(USERS_KEY, []);
  if (!localStorage.getItem(ACTIVITIES_KEY)) setToStorage(ACTIVITIES_KEY, []);
  if (!localStorage.getItem(ACTIVITY_TYPES_KEY)) setToStorage(ACTIVITY_TYPES_KEY, initialActivityTypes);
  if (!localStorage.getItem(PENALTY_CHECKS_KEY)) setToStorage(PENALTY_CHECKS_KEY, {});
  if (!localStorage.getItem(SETTINGS_KEY)) setToStorage(SETTINGS_KEY, { weeklyGoalMinutes: 60, penaltyAmount: 5 });
  if (!localStorage.getItem(CHAT_MESSAGES_KEY)) setToStorage(CHAT_MESSAGES_KEY, []);
};

// User Management
export const getUsers = async (): Promise<User[]> => getFromStorage<User[]>(USERS_KEY, []);
export const addUser = async (userData: Omit<User, 'id' | 'cumulativePenalty' | 'createdAt'>): Promise<User | null> => {
  const users = await getUsers();
  if (users.some(u => u.username.toLowerCase() === userData.username.toLowerCase())) {
    return null; // Username already exists
  }
  const newUser: User = {
    ...userData,
    id: Date.now().toString(),
    cumulativePenalty: 0,
    createdAt: new Date().toISOString(),
  };
  setToStorage(USERS_KEY, [...users, newUser]);
  return newUser;
};
export const updateUser = async (updatedUser: User): Promise<void> => {
    const users = await getUsers();
    const userIndex = users.findIndex(u => u.id === updatedUser.id);
    if (userIndex > -1) {
        users[userIndex] = updatedUser;
        setToStorage(USERS_KEY, users);
    }
};
export const authenticateUser = async (username: string, password: string): Promise<User | null> => {
  const users = await getUsers();
  const user = users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === password);
  return user || null;
};

// Activity Management
export const getActivities = async (): Promise<Activity[]> => getFromStorage<Activity[]>(ACTIVITIES_KEY, []);
export const addActivity = async (activityData: Omit<Activity, 'id' | 'date'> & { userId: string }): Promise<Activity> => {
  const activities = await getActivities();
  const newActivity: Activity = {
    ...activityData,
    id: Date.now().toString(),
    date: new Date().toISOString(),
  };
  setToStorage(ACTIVITIES_KEY, [...activities, newActivity]);
  return newActivity;
};
export const getActivitiesForWeek = async (date: Date): Promise<Activity[]> => {
    const allActivities = await getActivities();
    const weekStart = getWeekStart(date);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    return allActivities.filter(a => {
        const activityDate = new Date(a.date);
        return activityDate >= weekStart && activityDate < weekEnd;
    });
};

// Activity Type Management
export const getActivityTypes = async (): Promise<ActivityType[]> => getFromStorage<ActivityType[]>(ACTIVITY_TYPES_KEY, []);
export const addActivityType = async (activityTypeData: Omit<ActivityType, 'id'>): Promise<ActivityType> => {
    const types = await getActivityTypes();
    const newType: ActivityType = {
        ...activityTypeData,
        id: Date.now().toString(),
    };
    setToStorage(ACTIVITY_TYPES_KEY, [...types, newType]);
    return newType;
};

// Session Management
export const setLoggedInUser = (user: User) => setToStorage(LOGGED_IN_USER_KEY, user);
export const getLoggedInUser = (): User | null => getFromStorage<User | null>(LOGGED_IN_USER_KEY, null);
export const clearLoggedInUser = () => localStorage.removeItem(LOGGED_IN_USER_KEY);

// Penalty Logic
export const hasPenaltyBeenApplied = (weekId: string): boolean => {
    const checks = getFromStorage<Record<string, boolean>>(PENALTY_CHECKS_KEY, {});
    return !!checks[weekId];
};

export const markPenaltyAsApplied = (weekId: string): void => {
    const checks = getFromStorage<Record<string, boolean>>(PENALTY_CHECKS_KEY, {});
    checks[weekId] = true;
    setToStorage(PENALTY_CHECKS_KEY, checks);
};

// Settings Management
export const getSettings = async (): Promise<AppSettings> => getFromStorage<AppSettings>(SETTINGS_KEY, { weeklyGoalMinutes: 60, penaltyAmount: 5 });
export const updateSettings = async (newSettings: AppSettings): Promise<void> => setToStorage(SETTINGS_KEY, newSettings);

// Chat Management
export const getChatMessages = async (): Promise<ChatMessage[]> => getFromStorage<ChatMessage[]>(CHAT_MESSAGES_KEY, []);
export const addChatMessage = async (messageData: Omit<ChatMessage, 'id'>): Promise<ChatMessage> => {
    const messages = await getChatMessages();
    const newMessage: ChatMessage = {
        ...messageData,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
    };
    setToStorage(CHAT_MESSAGES_KEY, [...messages, newMessage]);
    return newMessage;
};
