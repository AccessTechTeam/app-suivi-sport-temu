
// A day is 0-6 (Sun-Sat), we want to adjust to Mon-Sun
const getDayCorrected = (date: Date): number => {
    const day = date.getDay();
    return day === 0 ? 6 : day - 1; // Mon:0, Tue:1, ..., Sun:6
};

export const getWeekStart = (date: Date): Date => {
    const d = new Date(date);
    const day = getDayCorrected(d);
    d.setDate(d.getDate() - day);
    d.setHours(0, 0, 0, 0);
    return d;
};

export const getWeekEnd = (date: Date): Date => {
    const d = new Date(date);
    const day = getDayCorrected(d);
    d.setDate(d.getDate() + (6 - day));
    d.setHours(23, 59, 59, 999);
    return d;
};

export const getWeekId = (date: Date): string => {
    const start = getWeekStart(date);
    return start.toISOString().split('T')[0];
};

export const formatMinutes = (minutes: number): string => {
    if (minutes < 60) {
        return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) {
        return `${hours}h`;
    }
    return `${hours}h ${remainingMinutes}m`;
};

export const isReminderTime = (): boolean => {
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday
    const hours = now.getHours();
    return day === 0 && hours >= 18;
};
