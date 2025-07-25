import React, { useMemo } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { getWeekId, getWeekStart, formatMinutes } from '../utils/dateUtils';
import Card from '../components/Card';
import Button from '../components/Button';
import { CheckCircleIcon, XCircleIcon } from '../components/icons';

interface WeeklyHistory {
  weekId: string;
  startDate: string;
  totalMinutes: number;
  goalMet: boolean;
}

const HistoryScreen: React.FC = () => {
  const { activities, currentUser, setPage, settings } = useAppContext();

  const history: WeeklyHistory[] = useMemo(() => {
    if (!currentUser || !settings) return [];

    const userActivities = activities.filter(a => a.userId === currentUser.id && a.activityTypeId !== 'gave-up');
    const weeks: { [key: string]: number } = {};

    userActivities.forEach(activity => {
      const weekId = getWeekId(new Date(activity.date));
      if (!weeks[weekId]) {
        weeks[weekId] = 0;
      }
      weeks[weekId] += activity.duration;
    });

    return Object.entries(weeks)
      .map(([weekId, totalMinutes]) => ({
        weekId,
        startDate: getWeekStart(new Date(weekId)).toLocaleDateString('fr-FR'),
        totalMinutes,
        goalMet: totalMinutes >= settings.weeklyGoalMinutes,
      }))
      .sort((a, b) => new Date(b.weekId).getTime() - new Date(a.weekId).getTime());
  }, [activities, currentUser, settings]);

  if (!settings) return null;

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <h2 className="text-2xl font-bold text-gray-800">Mon historique d'activité</h2>
        <p className="text-gray-500 mb-6">Un récapitulatif de vos performances hebdomadaires.</p>

        {history.length > 0 ? (
          <ul className="space-y-4">
            {history.map(item => (
              <li key={item.weekId} className={`flex items-center justify-between p-4 rounded-lg ${item.goalMet ? 'bg-green-50' : 'bg-red-50'}`}>
                <div>
                  <p className="font-semibold text-gray-900">Semaine du {item.startDate}</p>
                  <p className="text-sm text-gray-600">Temps total : {formatMinutes(item.totalMinutes)}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {item.goalMet ? (
                    <>
                      <span className="text-sm font-medium text-brand-success">Objectif atteint</span>
                      <CheckCircleIcon className="text-brand-success" />
                    </>
                  ) : (
                    <>
                      <span className="text-sm font-medium text-brand-danger">Objectif manqué</span>
                      <XCircleIcon className="text-brand-danger" />
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500 py-8">Aucun historique d'activité pour le moment. Au travail !</p>
        )}
        
        <div className="mt-8">
            <Button variant="secondary" onClick={() => setPage('dashboard')}>Retour au tableau de bord</Button>
        </div>
      </Card>
    </div>
  );
};

export default HistoryScreen;
