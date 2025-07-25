import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User, Activity, ActivityType, Page, AppSettings, ChatMessage } from '../types';
import * as dataService from '../services/dataService';
import { getWeekId } from '../utils/dateUtils';

interface AppContextType {
  page: Page;
  setPage: (page: Page) => void;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  users: User[];
  activities: Activity[];
  activityTypes: ActivityType[];
  settings: AppSettings | null;
  chatMessages: ChatMessage[];
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  signup: (username: string, password: string, isCoach: boolean) => Promise<boolean>;
  addActivity: (activity: Omit<Activity, 'id' | 'userId' | 'date'>) => Promise<void>;
  addActivityType: (activityType: Omit<ActivityType, 'id'>) => Promise<void>;
  coachTip: string;
  generateCoachTip: (topic: string) => Promise<void>;
  loadingTip: boolean;
  refreshData: () => void;
  giveUpWeek: (userId: string) => Promise<void>;
  updateSettings: (newSettings: AppSettings) => Promise<void>;
  updateUserPenalty: (userId: string, newPenalty: number) => Promise<void>;
  sendMessage: (message: string) => Promise<void>;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [page, setPage] = useState<Page>('login');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activityTypes, setActivityTypes] = useState<ActivityType[]>([]);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [coachTip, setCoachTip] = useState('');
  const [loadingTip, setLoadingTip] = useState(false);

  const applyPenalties = useCallback(async (appSettings: AppSettings) => {
    if (!appSettings) return;
    const today = new Date();
    if (today.getDay() !== 1) return; // Only run on Mondays

    const lastWeekDate = new Date();
    lastWeekDate.setDate(lastWeekDate.getDate() - 1);
    const lastWeekId = getWeekId(lastWeekDate);
    
    if (dataService.hasPenaltyBeenApplied(lastWeekId)) return;

    const allUsers = await dataService.getUsers();
    const lastWeekActivities = await dataService.getActivitiesForWeek(lastWeekDate);

    for (const user of allUsers) {
        const userActivities = lastWeekActivities.filter(a => a.userId === user.id);
        const totalMinutes = userActivities.reduce((sum, a) => sum + a.duration, 0);

        if (totalMinutes < appSettings.weeklyGoalMinutes) {
            await dataService.updateUser({ ...user, cumulativePenalty: user.cumulativePenalty + appSettings.penaltyAmount });
        }
    }
    
    dataService.markPenaltyAsApplied(lastWeekId);
    console.log(`Penalties for week ${lastWeekId} applied.`);
    refreshData();
  }, []);

  const refreshData = useCallback(async () => {
    if (currentUser) {
      const [fetchedUsers, fetchedActivities, fetchedActivityTypes, fetchedSettings, fetchedMessages] = await Promise.all([
        dataService.getUsers(),
        dataService.getActivities(),
        dataService.getActivityTypes(),
        dataService.getSettings(),
        dataService.getChatMessages(),
      ]);
      setUsers(fetchedUsers);
      setActivities(fetchedActivities);
      setActivityTypes(fetchedActivityTypes);
      setSettings(fetchedSettings);
      setChatMessages(fetchedMessages.sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()));
    }
  }, [currentUser]);

  useEffect(() => {
    dataService.initializeData();
    const loggedInUser = dataService.getLoggedInUser();
    if (loggedInUser) {
        setCurrentUser(loggedInUser);
        setPage('dashboard');
    }
    dataService.getSettings().then(s => applyPenalties(s));
  }, [applyPenalties]);
  
  useEffect(() => {
    if (currentUser) {
      refreshData();
    }
  }, [currentUser, refreshData]);

  const login = async (username: string, password: string): Promise<boolean> => {
    const user = await dataService.authenticateUser(username, password);
    if (user) {
      setCurrentUser(user);
      dataService.setLoggedInUser(user);
      setPage('dashboard');
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    dataService.clearLoggedInUser();
    setPage('login');
  };

  const signup = async (username: string, password: string, isCoach: boolean): Promise<boolean> => {
    const newUser = await dataService.addUser({ username, password, isCoach });
    if (newUser) {
      setCurrentUser(newUser);
      dataService.setLoggedInUser(newUser);
      setPage('dashboard');
      return true;
    }
    return false;
  };

  const addActivity = async (activity: Omit<Activity, 'id' | 'userId' | 'date'>) => {
    if (currentUser) {
      await dataService.addActivity({ ...activity, userId: currentUser.id });
      refreshData();
    }
  };
  
  const addActivityType = async (activityType: Omit<ActivityType, 'id'>) => {
    await dataService.addActivityType(activityType);
    refreshData();
  };
  
  const updateSettings = async (newSettings: AppSettings) => {
      await dataService.updateSettings(newSettings);
      refreshData();
  };
  
  const updateUserPenalty = async (userId: string, newPenalty: number) => {
      const user = users.find(u => u.id === userId);
      if (user) {
          await dataService.updateUser({ ...user, cumulativePenalty: newPenalty });
          refreshData();
      }
  };
  
  const sendMessage = async (message: string) => {
      if(currentUser) {
          await dataService.addChatMessage({
              userId: currentUser.id,
              username: currentUser.username,
              message,
              timestamp: new Date().toISOString(),
          });
          refreshData();
      }
  };

  const generateCoachTip = async (topic: string) => {
    setLoadingTip(true);
    setCoachTip('');
    try {
      const geminiService = (await import('../services/geminiService.ts')).default;
      const tip = await geminiService.generateMotivationalTip(topic);
      setCoachTip(tip);
    } catch (error) {
      console.error("Failed to generate coach tip:", error);
      setCoachTip("Impossible de générer un conseil pour le moment. Veuillez réessayer plus tard.");
    } finally {
      setLoadingTip(false);
    }
  };

  const giveUpWeek = async (userId: string) => {
     if (!settings) return;
     const user = users.find(u => u.id === userId);
     if (user) {
        await dataService.updateUser({ ...user, cumulativePenalty: user.cumulativePenalty + settings.penaltyAmount });
        await dataService.addActivity({
            userId: user.id,
            activityTypeId: 'gave-up',
            duration: 0
        });
        refreshData();
     }
  };

  return (
    <AppContext.Provider value={{
      page,
      setPage,
      currentUser,
      setCurrentUser,
      users,
      activities,
      activityTypes,
      settings,
      chatMessages,
      login,
      logout,
      signup,
      addActivity,
      addActivityType,
      coachTip,
      generateCoachTip,
      loadingTip,
      refreshData,
      giveUpWeek,
      updateSettings,
      updateUserPenalty,
      sendMessage,
    }}>
      {children}
    </AppContext.Provider>
  );
};