"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Plus, X, Clock, MapPin, Tag } from 'lucide-react';

// --- Global Firebase & Auth Mock Variables (MUST be included for runtime environment) ---
// These global variables are expected to be available in the execution environment.
const __app_id = typeof window !== 'undefined' && typeof (window as any).__app_id !== 'undefined' ? (window as any).__app_id : 'default-app-id';
const __firebase_config = typeof window !== 'undefined' && typeof (window as any).__firebase_config !== 'undefined' ? (window as any).__firebase_config : '{}';
const __initial_auth_token = typeof window !== 'undefined' && typeof (window as any).__initial_auth_token !== 'undefined' ? (window as any).__initial_auth_token : undefined;

// --- MOCK FIREBASE IMPORTS AND SETUP (Self-Contained) ---
// In a real environment, these would be actual Firebase SDK functions.
const firebaseConfig = JSON.parse(__firebase_config);

const MOCK_DB = {
    events: [] as EventData[]
};

let isAuthenticated = false;
let currentUserId = 'mock-user-id'; // Default ID if no token

// Mock Firebase SDK Functions
const getFirestore = () => ({});
const getAuth = () => ({});
const initializeApp = (config: any) => ({});
const signInWithCustomToken = async (auth: any, token: string) => { currentUserId = 'mock-auth-id'; isAuthenticated = true; };
const signInAnonymously = async (auth: any) => { currentUserId = crypto.randomUUID(); isAuthenticated = true; };

const initializeFirebase = async () => {
    // In a real app, you'd initialize and authenticate here
    // const app = initializeApp(firebaseConfig);
    // const auth = getAuth(app);
    // if (__initial_auth_token) { await signInWithCustomToken(auth, __initial_auth_token); } else { await signInAnonymously(auth); }
    // return { db: getFirestore(app), userId: currentUserId };
    if (!isAuthenticated) {
        if (__initial_auth_token) {
            currentUserId = 'authenticated-user-' + __app_id.substring(0, 5);
        } else {
            currentUserId = 'anonymous-user-' + crypto.randomUUID().substring(0, 5);
        }
        isAuthenticated = true;
    }
    return { db: MOCK_DB, userId: currentUserId };
};

// Mock onSnapshot/collection/addDoc
const collection = (db: any, path: string) => ({ path });
const query = (col: any) => col;

const onSnapshot = (q: { path: string }, callback: (snapshot: { docs: any }) => void) => {
    // Simulate initial data load
    callback({ docs: MOCK_DB.events.map(e => ({ data: () => e, id: e.id })) });

    // In a real app, this would return an unsubscribe function.
    const interval = setInterval(() => {
        // Simulate real-time updates by re-running the callback
        callback({ docs: MOCK_DB.events.map(e => ({ data: () => e, id: e.id })) });
    }, 5000); 

    return () => clearInterval(interval);
};

const addDoc = async (col: { path: string }, data: any) => {
    const newEvent: EventData = { id: crypto.randomUUID(), ...data };
    MOCK_DB.events.push(newEvent);
    console.log("Mock Firestore: Added Event", newEvent);
};
// --- END MOCK FIREBASE SETUP ---

// --- UTILITY TYPES AND CONSTANTS ---
type EventColor = 'red' | 'blue' | 'green' | 'purple';

interface EventData {
    id: string;
    title: string;
    date: number; // Day of the month
    month: number;
    year: number;
    time: string; // e.g., "14:30"
    venue: string;
    color: EventColor;
    fullDate: string; // YYYY-MM-DD
}

const COLOR_MAP: Record<EventColor, string> = {
    red: 'bg-red-500 text-white hover:bg-red-600',
    blue: 'bg-blue-500 text-white hover:bg-blue-600',
    green: 'bg-green-500 text-white hover:bg-green-600',
    purple: 'bg-purple-500 text-white hover:bg-purple-600',
};

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// --- CALENDAR HELPERS ---

/** Returns the number of days in a given month/year. */
const getDaysInMonth = (month: number, year: number): number => new Date(year, month + 1, 0).getDate();

/** Returns the day of the week (0-6) for the first day of the month. */
const getFirstDayOfMonth = (month: number, year: number): number => new Date(year, month, 1).getDay();

/** Formats a Date object to YYYY-MM-DD string. */
const formatDateKey = (date: Date): string => date.toISOString().split('T')[0];


// --- EVENT FORM MODAL COMPONENT ---
interface EventFormModalProps {
    date: Date;
    isOpen: boolean;
    onClose: () => void;
    onSave: (event: Omit<EventData, 'id'>) => void;
}

const EventFormModal: React.FC<EventFormModalProps> = ({ date, isOpen, onClose, onSave }) => {
    const defaultDateKey = formatDateKey(date);
    const [title, setTitle] = useState('');
    const [time, setTime] = useState('');
    const [venue, setVenue] = useState('');
    const [color, setColor] = useState<EventColor>('blue');
    const [dateKey, setDateKey] = useState(defaultDateKey);

    useEffect(() => {
        if (isOpen) {
            setDateKey(formatDateKey(date));
            setTitle('');
            setTime('09:00');
            setVenue('');
            setColor('blue');
        }
    }, [isOpen, date]);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!title || !time || !dateKey) return;

        const selectedDate = new Date(dateKey + 'T00:00:00');

        onSave({
            title,
            time,
            venue,
            color,
            fullDate: dateKey,
            date: selectedDate.getDate(),
            month: selectedDate.getMonth(),
            year: selectedDate.getFullYear(),
        });

        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
                <div className="flex justify-between items-center p-5 border-b">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center">
                        <Plus className="h-5 w-5 mr-2 text-primary" /> New Event
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition">
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title / Task</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            placeholder="e.g., Final Project Submission"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 transition"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <input
                            type="date"
                            value={dateKey}
                            onChange={(e) => setDateKey(e.target.value)}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 transition"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                <Clock className="h-4 w-4 mr-1 text-blue-500" /> Time
                            </label>
                            <input
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                required
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                <MapPin className="h-4 w-4 mr-1 text-green-500" /> Venue
                            </label>
                            <input
                                type="text"
                                value={venue}
                                onChange={(e) => setVenue(e.target.value)}
                                placeholder="Optional (e.g., Library, Zoom)"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 transition"
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                            <Tag className="h-4 w-4 mr-1 text-purple-500" /> Category Color
                        </label>
                        <div className="flex space-x-2">
                            {Object.keys(COLOR_MAP).map((c) => (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => setColor(c as EventColor)}
                                    className={`w-10 h-10 rounded-full border-4 transition-all duration-150 ${COLOR_MAP[c as EventColor]} ${color === c ? 'border-purple-400 ring-4 ring-offset-2 ring-purple-300' : 'border-transparent'}`}
                                    aria-label={`Select color ${c}`}
                                />
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full p-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200"
                    >
                        Save Event
                    </button>
                </form>
            </div>
        </div>
    );
};


// --- MAIN APP COMPONENT ---

const CalendarApp = () => {
    const today = useMemo(() => new Date(), []);
    const [currentDate, setCurrentDate] = useState(today); // Tracks the month/year being viewed
    const [selectedDate, setSelectedDate] = useState(today); // Tracks the currently selected day
    const [events, setEvents] = useState<EventData[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [db, setDb] = useState<any>(null);
    const [userId, setUserId] = useState<string | null>(null);

    // 1. Initialize Firebase and Authentication
    useEffect(() => {
        initializeFirebase().then(({ db, userId }) => {
            setDb(db);
            setUserId(userId);
        }).catch(err => {
            console.error("Firebase init failed:", err);
        });
    }, []);

    // 2. Setup Firestore Listener
    useEffect(() => {
        if (!db || !userId) return;

        const collectionPath = `/artifacts/${__app_id}/users/${userId}/calendar_events`;
        console.log("Listening to path:", collectionPath);

        const q = query(collection(db, collectionPath));
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedEvents: EventData[] = [];
            snapshot.docs.forEach((doc: any) => {
                const data = doc.data();
                // FIX: data is the returned object from doc.data(), not a function. Spread it directly.
                fetchedEvents.push({ ...data, id: doc.id }); 
            });
            setEvents(fetchedEvents);
            console.log("Fetched events:", fetchedEvents.length);
        });

        return () => {
            // In a real app, this would unsubscribe from the listener
            // unsubscribe();
            console.log("Mock Firestore: Listener cleanup.");
        };
    }, [db, userId]);

    // Calendar navigation
    const navigateMonth = (direction: 'prev' | 'next') => {
        const newDate = new Date(currentDate.getTime());
        newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
        setCurrentDate(newDate);
    };

    // Event handler for saving a new event
    const handleSaveEvent = useCallback(async (event: Omit<EventData, 'id'>) => {
        if (!db || !userId) {
            console.error("Database not ready.");
            return;
        }

        try {
            const collectionPath = `/artifacts/${__app_id}/users/${userId}/calendar_events`;
            await addDoc(collection(db, collectionPath), event);
            // Re-fetch logic is handled by the onSnapshot mock above.
        } catch (error) {
            console.error("Error adding document:", error);
        }
    }, [db, userId]);

    // Calendar rendering logic
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const daysInMonth = getDaysInMonth(month, year);
    const firstDay = getFirstDayOfMonth(month, year);

    const calendarDays = useMemo(() => {
        const days: (number | null)[] = [];
        for (let i = 0; i < firstDay; i++) {
            days.push(null); // Blanks for preceding month
        }
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(day);
        }
        return days;
    }, [month, year, daysInMonth, firstDay]);

    // Group events by date for easy lookup
    const eventsByDate = useMemo(() => {
        return events.reduce((acc, event) => {
            const key = event.fullDate;
            if (!acc[key]) acc[key] = [];
            acc[key].push(event);
            return acc;
        }, {} as Record<string, EventData[]>);
    }, [events]);

    const handleDayClick = (day: number) => {
        const newSelected = new Date(year, month, day);
        setSelectedDate(newSelected);
    };

    const handleAddEventClick = (day: number) => {
        handleDayClick(day); // Select the day first
        setIsModalOpen(true);
    };
    
    // Detailed Event List for selected day
    const selectedDateKey = formatDateKey(selectedDate);
    const selectedDayEvents = eventsByDate[selectedDateKey] || [];
    
    // Helper function for UI checks
    const isToday = (day: number) => {
        const checkDate = new Date(year, month, day);
        return formatDateKey(checkDate) === formatDateKey(today);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Academic Calendar</h1>
            <p className="text-sm text-gray-600 mb-4">User ID: <span className="font-mono bg-gray-200 px-2 py-0.5 rounded text-xs">{userId || 'Loading...'}</span></p>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* CALENDAR VIEW (Left/Middle Column) */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-xl">
                    
                    {/* Month Header */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">
                            {MONTH_NAMES[month]} {year}
                        </h2>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => navigateMonth('prev')}
                                className="p-2 rounded-full text-gray-600 hover:bg-gray-100 transition"
                                aria-label="Previous Month"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                            <button
                                onClick={() => setCurrentDate(today)}
                                className="px-4 py-2 rounded-lg text-sm font-semibold bg-purple-500 text-white hover:bg-purple-600 transition"
                            >
                                Today
                            </button>
                            <button
                                onClick={() => navigateMonth('next')}
                                className="p-2 rounded-full text-gray-600 hover:bg-gray-100 transition"
                                aria-label="Next Month"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Day Names Grid */}
                    <div className="grid grid-cols-7 text-center font-medium text-gray-500 border-b pb-2 mb-2">
                        {DAY_NAMES.map(day => <span key={day}>{day}</span>)}
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-1">
                        {calendarDays.map((day, index) => {
                            const dateKey = day ? formatDateKey(new Date(year, month, day)) : null;
                            const isSelected = dateKey === selectedDateKey;
                            const dayEvents = dateKey ? eventsByDate[dateKey] || [] : [];
                            
                            return (
                                <div
                                    key={index}
                                    className={`aspect-square p-1.5 cursor-pointer rounded-lg transition-all duration-150 relative overflow-hidden group 
                                        ${day === null ? 'bg-gray-50' : isSelected ? 'bg-purple-100 ring-2 ring-purple-500 shadow-md' : isToday(day!) ? 'bg-yellow-50 border border-yellow-300' : 'hover:bg-gray-100'}`
                                    }
                                    onClick={day !== null ? () => handleDayClick(day) : undefined}
                                >
                                    {day !== null && (
                                        <>
                                            <div className={`text-sm font-bold w-6 h-6 flex items-center justify-center rounded-full transition ${isSelected ? 'text-purple-700 bg-white shadow' : 'text-gray-800'}`}>
                                                {day}
                                            </div>
                                            <div className="absolute top-1 right-1">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleAddEventClick(day); }}
                                                    className={`p-1 rounded-full text-white bg-purple-500/80 group-hover:bg-purple-600 transition opacity-0 group-hover:opacity-100 absolute -top-0 -right-0`}
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </button>
                                            </div>
                                            
                                            {/* Event Indicators */}
                                            <div className="flex flex-wrap mt-1">
                                                {dayEvents.slice(0, 3).map((event, i) => (
                                                    <div 
                                                        key={event.id}
                                                        className={`w-2 h-2 rounded-full mr-0.5 mt-0.5 ${COLOR_MAP[event.color].split(' ')[0]} ${COLOR_MAP[event.color].split(' ')[1]}`.replace('text-white', '')}
                                                        title={`${event.title} at ${event.time}`}
                                                    />
                                                ))}
                                                {dayEvents.length > 3 && <span className="text-xs text-gray-500 ml-1">+{dayEvents.length - 3}</span>}
                                            </div>
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* SELECTED DAY DETAILS (Right Column) */}
                <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-xl">
                    <div className="flex justify-between items-center mb-6 border-b pb-4">
                        <h3 className="text-xl font-bold text-gray-800">
                            {MONTH_NAMES[selectedDate.getMonth()]} {selectedDate.getDate()}, {selectedDate.getFullYear()}
                        </h3>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="p-2 rounded-full text-white bg-purple-500 hover:bg-purple-600 transition shadow-md"
                        >
                            <Plus className="h-5 w-5" />
                        </button>
                    </div>

                    {selectedDayEvents.length > 0 ? (
                        <div className="space-y-4">
                            {selectedDayEvents
                                .sort((a, b) => a.time.localeCompare(b.time))
                                .map((event) => (
                                <div key={event.id} className="relative pl-3 border-l-4 border-gray-200">
                                    <div className={`absolute left-0 top-0 h-full w-1 rounded ${COLOR_MAP[event.color].split(' ')[0]}`} />
                                    <p className="text-lg font-semibold text-gray-900">{event.title}</p>
                                    <div className="flex items-center text-sm text-gray-600 space-x-4 mt-0.5">
                                        <div className="flex items-center">
                                            <Clock className="h-4 w-4 mr-1 text-gray-400" />
                                            <span>{event.time}</span>
                                        </div>
                                        {event.venue && (
                                            <div className="flex items-center">
                                                <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                                                <span>{event.venue}</span>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-xs mt-2 italic">Color: {event.color.charAt(0).toUpperCase() + event.color.slice(1)}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-10">No events scheduled for this day.</p>
                    )}
                </div>
            </div>

            {/* Event Submission Modal */}
            <EventFormModal
                date={selectedDate}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveEvent}
            />
        </div>
    );
}

export default CalendarApp;