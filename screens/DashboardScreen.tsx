import React, { useMemo, useState, useEffect } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { getWeekStart, formatMinutes, isReminderTime } from '../utils/dateUtils';
import { WeeklySummary, AppSettings, Activity } from '../types';
import Button from '../components/Button';
import Card from '../components/Card';
import Chat from '../components/Chat';
import { CheckCircleIcon, XCircleIcon, ClockIcon, PlusCircleIcon, ChartBarIcon, SparklesIcon, PencilIcon, ChevronDownIcon } from '../components/icons';

const UserStatusItem: React.FC<{ 
    summary: WeeklySummary;
    activities: Activity[];
    currentUserId: string; 
    isCoach: boolean;
    weeklyGoal: number;
    onGiveUp: (userId: string) => void;
    onUpdatePenalty: (userId: string, newPenalty: number) => void;
}> = ({ summary, activities, currentUserId, isCoach, weeklyGoal, onGiveUp, onUpdatePenalty }) => {
    const { activityTypes } = useAppContext();
    const [isExpanded, setIsExpanded] = useState(false);
    const progress = Math.min((summary.totalMinutes / weeklyGoal) * 100, 100);
    const hasGivenUp = summary.status === 'failed';
    const userPenalty = useAppContext().users.find(u => u.id === summary.userId)?.cumulativePenalty ?? 0;
    const [isEditingPenalty, setIsEditingPenalty] = useState(false);
    const [penaltyValue, setPenaltyValue] = useState(userPenalty.toString());

    const getStatusIcon = () => {
        if (summary.status === 'achieved') return <CheckCircleIcon className="text-brand-success" />;
        if (hasGivenUp || (isReminderTime() && summary.status === 'pending')) return <XCircleIcon className="text-brand-danger" />;
        return <ClockIcon className="text-brand-warning" />;
    };

    const handlePenaltyUpdate = () => {
        const newPenalty = parseInt(penaltyValue, 10);
        if (!isNaN(newPenalty) && newPenalty >= 0) {
            onUpdatePenalty(summary.userId, newPenalty);
        }
        setIsEditingPenalty(false);
    }

    return (
        <li className="flex flex-col p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="flex items-center space-x-4 flex-1">
                    <div className="text-xl">{getStatusIcon()}</div>
                    <div className="flex-grow">
                        <p className="font-semibold text-gray-800">{summary.username}{summary.userId === currentUserId ? ' (Vous)' : ''}</p>
                        <p className="text-sm text-gray-500">{formatMinutes(summary.totalMinutes)} / {formatMinutes(weeklyGoal)}</p>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                            <div className="bg-brand-secondary h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center">
                    <div className="text-right ml-4">
                        {isEditingPenalty ? (
                            <div className="flex items-center space-x-1">
                                <input 
                                    type="number"
                                    value={penaltyValue}
                                    onChange={(e) => setPenaltyValue(e.target.value)}
                                    className="w-16 p-1 border rounded text-right"
                                    autoFocus
                                    onClick={(e) => e.stopPropagation()}
                                />
                                <button onClick={(e) => {e.stopPropagation(); handlePenaltyUpdate();}}><CheckCircleIcon className="text-green-500"/></button>
                                <button onClick={(e) => {e.stopPropagation(); setIsEditingPenalty(false);}}><XCircleIcon className="text-red-500"/></button>
                            </div>
                        ) : (
                            <div className="flex items-center justify-end space-x-2">
                                <p className="font-bold text-gray-800">€{userPenalty}</p>
                                {isCoach && <button onClick={(e) => {e.stopPropagation(); setIsEditingPenalty(true);}}><PencilIcon className="text-gray-400 hover:text-brand-primary"/></button>}
                            </div>
                        )}
                        <p className="text-xs text-gray-500">Pénalités</p>
                        {summary.userId === currentUserId && summary.status === 'pending' && !hasGivenUp && (
                            <button onClick={(e) => {e.stopPropagation(); onGiveUp(summary.userId)}} className="text-xs text-red-500 hover:underline">Abandonner</button>
                        )}
                    </div>
                    <ChevronDownIcon className={`ml-2 text-gray-500 transition-transform transform ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
            </div>
            {isExpanded && (
                <div className="mt-4 pt-4 border-t border-gray-200 pl-10">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Activités de la semaine</h4>
                    {activities.length > 0 ? (
                        <ul className="space-y-3">
                            {activities.map(act => {
                                const type = activityTypes.find(t => t.id === act.activityTypeId);
                                if (!type) return null;
                                return (
                                    <li key={act.id} className="text-sm">
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium text-gray-800">{type.icon} {type.name}</span>
                                            <span className="text-gray-600">{formatMinutes(act.duration)}</span>
                                        </div>
                                        {act.comment && (
                                            <blockquote className="pl-5 text-xs italic text-gray-500 mt-1 border-l-2 border-gray-300">"{act.comment}"</blockquote>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <p className="text-sm text-gray-500 italic">Aucune activité enregistrée cette semaine.</p>
                    )}
                </div>
            )}
        </li>
    );
};

const CoachCorner: React.FC = () => {
    const { currentUser, coachTip, generateCoachTip, loadingTip } = useAppContext();
    const [topic, setTopic] = useState("rester motivé");
  
    if (!currentUser?.isCoach) return null;
  
    const handleGenerateTip = (e: React.FormEvent) => {
      e.preventDefault();
      if(topic.trim()) generateCoachTip(topic.trim());
    }
  
    return (
      <Card>
        <h3 className="text-lg font-bold text-brand-primary flex items-center"><SparklesIcon className="mr-2"/> Le coin du coach</h3>
        <form onSubmit={handleGenerateTip} className="flex items-center space-x-2 mt-2">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Sujet du conseil (ex: récupération)"
            className="flex-grow p-2 border border-gray-300 rounded-lg focus:ring-brand-secondary focus:border-brand-secondary"
          />
          <Button type="submit" className="w-auto px-4 py-2 text-sm" disabled={loadingTip}>
            {loadingTip ? 'Génération...' : 'Nouveau conseil'}
          </Button>
        </form>
        {coachTip && (
          <blockquote className="mt-4 p-4 bg-blue-50 border-l-4 border-brand-secondary text-gray-700 italic">
            {coachTip}
          </blockquote>
        )}
      </Card>
    );
};

const CoachSettings: React.FC = () => {
    const { currentUser, settings, updateSettings } = useAppContext();
    const [localSettings, setLocalSettings] = useState<AppSettings | null>(settings);

    useEffect(() => {
        setLocalSettings(settings);
    }, [settings]);

    if (!currentUser?.isCoach || !localSettings) return null;

    const handleSave = () => {
        if (localSettings) updateSettings(localSettings);
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setLocalSettings(prev => prev ? {...prev, [name]: parseInt(value, 10)} : null);
    }

    return (
        <Card>
            <h3 className="text-lg font-bold text-brand-primary">Paramètres du coach</h3>
            <div className="space-y-4 mt-2">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Objectif hebdo (minutes)</label>
                    <input type="number" name="weeklyGoalMinutes" value={localSettings.weeklyGoalMinutes} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md"/>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Pénalité (€)</label>
                    <input type="number" name="penaltyAmount" value={localSettings.penaltyAmount} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md"/>
                </div>
                <Button onClick={handleSave} className="w-full py-2">Enregistrer</Button>
            </div>
        </Card>
    );
}

const DashboardScreen: React.FC = () => {
    const { users, activities, setPage, currentUser, giveUpWeek, refreshData, settings, updateUserPenalty } = useAppContext();
    const [showReminder, setShowReminder] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            refreshData(); 
        }, 15000); // every 15 seconds
        return () => clearInterval(interval);
    }, [refreshData]);

    const currentWeekStart = getWeekStart(new Date());
    const weekActivities = activities.filter(a => new Date(a.date) >= currentWeekStart);

    const weeklySummaries: WeeklySummary[] = useMemo(() => {
        if (!settings) return [];
        
        return users.map(user => {
            const userActivities = weekActivities.filter(a => a.userId === user.id);
            const totalMinutes = userActivities.reduce((sum, a) => sum + a.duration, 0);
            const goalMet = totalMinutes >= settings.weeklyGoalMinutes;
            const gaveUp = userActivities.some(a => a.activityTypeId === 'gave-up');

            let status: 'achieved' | 'pending' | 'failed' = 'pending';
            if (goalMet) status = 'achieved';
            else if (gaveUp) status = 'failed';

            return {
                userId: user.id,
                username: user.username,
                totalMinutes,
                goalMet,
                status,
            };
        });
    }, [users, weekActivities, settings]);

    const totalPenaltyPot = useMemo(() => {
        return users.reduce((sum, user) => sum + user.cumulativePenalty, 0);
    }, [users]);
    
    const currentUserSummary = weeklySummaries.find(s => s.userId === currentUser?.id);
    
    useEffect(() => {
        if(settings && currentUserSummary && !currentUserSummary.goalMet && isReminderTime()){
            setShowReminder(true);
        } else {
            setShowReminder(false);
        }
    }, [currentUserSummary, settings]);

    if (!currentUser || !settings) return (
        <div className="text-center p-10">
            <p>Chargement des données...</p>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card>
                        <h2 className="text-2xl font-bold text-gray-800">Progression de la semaine</h2>
                        <p className="text-gray-500">Suivez l'activité de chacun pour la semaine en cours.</p>
                        <ul className="mt-4 space-y-3">
                            {weeklySummaries.sort((a,b) => b.totalMinutes - a.totalMinutes).map(summary => {
                                const userWeekActivities = weekActivities
                                    .filter(act => act.userId === summary.userId && act.activityTypeId !== 'gave-up')
                                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                                
                                return (
                                    <UserStatusItem 
                                        key={summary.userId} 
                                        summary={summary} 
                                        activities={userWeekActivities}
                                        currentUserId={currentUser.id} 
                                        isCoach={currentUser.isCoach}
                                        weeklyGoal={settings.weeklyGoalMinutes}
                                        onGiveUp={giveUpWeek}
                                        onUpdatePenalty={updateUserPenalty}
                                    />
                                );
                            })}
                        </ul>
                    </Card>
                </div>
                <div className="space-y-6">
                    <Card className="text-center">
                        <h3 className="text-lg font-semibold text-gray-700">Cagnotte Globale</h3>
                        <p className="text-5xl font-extrabold text-brand-danger mt-2">€{totalPenaltyPot}</p>
                    </Card>
                     <div className="space-y-3">
                        <Button onClick={() => setPage('addActivity')} variant="primary">
                            <PlusCircleIcon /> <span className="ml-2">Déclarer une activité</span>
                        </Button>
                        <Button onClick={() => setPage('history')} variant="secondary">
                           <ChartBarIcon /> <span className="ml-2">Voir l'historique</span>
                        </Button>
                    </div>
                    {currentUser.isCoach && <CoachSettings />}
                    <Chat />
                </div>
            </div>
            {showReminder && (
                 <Card className="mt-6 bg-orange-100 border-orange-500 border-l-4">
                    <h3 className="font-bold text-orange-800">Rappel !</h3>
                    <p className="text-orange-700">Vous n'avez pas encore atteint votre objectif de {settings.weeklyGoalMinutes} minutes. Vous avez jusqu'à minuit pour éviter une pénalité de {settings.penaltyAmount}€ !</p>
                </Card>
            )}
             <div className="mt-6">
                 <CoachCorner />
             </div>
        </div>
    );
};

export default DashboardScreen;