"use client"; // (only needed for Next.js)

import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

interface Event {
  id: string;
  title: string;
  date: string;
  start?: string;
  end?: string;
  description?: string;
  type?: 'user' | 'holiday';
  color?: string;
  allDay?: boolean;
}

// Predefined holidays and custom events
const customEvents: Event[] = [
  {
    id: 'holiday-1',
    title: 'New Year\'s Day',
    date: '2025-01-01',
    description: 'Public Holiday',
    type: 'holiday',
    color: '#dc2626'
  },
  {
    id: 'holiday-2',
    title: 'Labour Day',
    date: '2025-05-01',
    description: 'International Workers\' Day',
    type: 'holiday',
    color: '#dc2626'
  },
  {
    id: 'holiday-3',
    title: 'Madaraka Day',
    date: '2025-06-01',
    description: 'Public Holiday',
    type: 'holiday',
    color: '#dc2626'
  },
  {
    id: 'holiday-4',
    title: 'Mashujaa Day',
    date: '2025-10-20',
    description: 'Heroes\' Day',
    type: 'holiday',
    color: '#dc2626'
  },
  {
    id: 'holiday-5',
    title: 'Jamhuri Day',
    date: '2025-12-12',
    description: 'Independence Day',
    type: 'holiday',
    color: '#dc2626'
  },
  {
    id: 'holiday-6',
    title: 'Christmas Day',
    date: '2025-12-25',
    description: 'Public Holiday',
    type: 'holiday',
    color: '#dc2626'
  },
  {
    id: 'holiday-7',
    title: 'Boxing Day',
    date: '2025-12-26',
    description: 'Public Holiday',
    type: 'holiday',
    color: '#dc2626'
  },
];

export default function CalendarApp() {
  const [userEvents, setUserEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    startTime: "",
    endTime: "",
    description: "",
    allDay: false,
  });

  // Combine user events with custom holidays
  const allEvents = [...customEvents, ...userEvents];

  // Load user events from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("calendarEvents");
    if (stored) setUserEvents(JSON.parse(stored));
  }, []);

  // Save user events whenever they change
  useEffect(() => {
    localStorage.setItem("calendarEvents", JSON.stringify(userEvents));
  }, [userEvents]);

  const handleDateClick = (info: any) => {
    setFormData((prev) => ({ ...prev, date: info.dateStr }));
    setSelectedDate(info.dateStr);
  };

  // Filter events for selected date
  const getEventsForDate = (date: string) => {
    return allEvents.filter(event => {
      const eventDate = event.start ? event.start.split('T')[0] : event.date;
      return eventDate === date;
    });
  };

  const filteredEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title && formData.date) {
      const newEvent: Event = {
        id: Date.now().toString(),
        title: formData.title,
        date: formData.date,
        start: formData.allDay ? undefined : `${formData.date}T${formData.startTime}`,
        end: formData.allDay ? undefined : `${formData.date}T${formData.endTime}`,
        description: formData.description,
        type: 'user',
        color: '#7e22ce',
        allDay: formData.allDay
      };
      setUserEvents((prev) => [...prev, newEvent]);
      setFormData({ title: "", date: "", startTime: "", endTime: "", description: "", allDay: false });
    }
  };

  const handleDelete = (id: string) => {
    setUserEvents((prev) => prev.filter((event) => event.id !== id));
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 bg-gray-50 min-h-screen">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 md:mb-6">My Calendar</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Calendar - First on mobile, Left on desktop */}
        <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 md:p-6 lg:col-span-2 order-1">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={allEvents.map(event => ({
              id: event.id,
              title: event.title,
              start: event.start || event.date,
              end: event.end,
              allDay: event.allDay !== false && !event.start,
              backgroundColor: event.color || '#7e22ce',
              borderColor: event.color || '#7e22ce',
            }))}
            dateClick={handleDateClick}
            height="600px"
            headerToolbar={{
              left: "prev,next",
              center: "title",
              right: "today",
            }}
            footerToolbar={{
              center: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            slotMinTime="06:00:00"
            slotMaxTime="22:00:00"
            allDaySlot={true}
            nowIndicator={true}
            dayMaxEvents={3}
            moreLinkText="more"
            dayHeaderFormat={{ weekday: 'short' }}
            slotLabelFormat={{
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            }}
            eventTimeFormat={{
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            }}
          />
        </div>

        {/* Right Column - Form and Events */}
        <div className="space-y-6 order-2">
          {/* Selected Day Events Card */}
          {selectedDate && (
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6 border-2 border-purple-500">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg sm:text-xl font-semibold">
                  Events on {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </h2>
                <button
                  onClick={() => setSelectedDate(null)}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Clear filter"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              <div className="space-y-2 sm:space-y-3 max-h-64 overflow-y-auto">
                {filteredEvents.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No events on this day</p>
                ) : (
                  filteredEvents.map((event) => (
                    <div
                      key={event.id}
                      className="border border-gray-200 rounded-lg p-2 sm:p-3 hover:shadow-md transition-shadow"
                      style={{ borderLeftWidth: '4px', borderLeftColor: event.color || '#7e22ce' }}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-sm sm:text-base text-gray-900">{event.title}</h3>
                            {event.type === 'holiday' && (
                              <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">Holiday</span>
                            )}
                          </div>
                          {event.start && event.end && (
                            <p className="text-sm text-gray-600 mt-1">
                              🕐 {new Date(event.start).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })} - {new Date(event.end).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          )}
                          {event.description && (
                            <p className="text-sm text-gray-700 mt-1">{event.description}</p>
                          )}
                        </div>
                        {event.type === 'user' && (
                          <button
                            onClick={() => handleDelete(event.id)}
                            className="ml-2 text-red-500 hover:text-red-700 transition-colors"
                            aria-label="Delete event"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Event Form Card */}
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Add New Event</h2>
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div>
                <label htmlFor="title" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-2 sm:px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="date" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Date *
                </label>
                <input
                  type="date"
                  id="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-2 sm:px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="allDay"
                  checked={formData.allDay}
                  onChange={(e) => setFormData({ ...formData, allDay: e.target.checked })}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <label htmlFor="allDay" className="text-xs sm:text-sm font-medium text-gray-700">
                  All day event
                </label>
              </div>

              {!formData.allDay && (
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <div>
                    <label htmlFor="startTime" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Start Time *
                    </label>
                    <input
                      type="time"
                      id="startTime"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      className="w-full px-2 sm:px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required={!formData.allDay}
                    />
                  </div>
                  <div>
                    <label htmlFor="endTime" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      End Time *
                    </label>
                    <input
                      type="time"
                      id="endTime"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      className="w-full px-2 sm:px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required={!formData.allDay}
                    />
                  </div>
                </div>
              )}
              
              <div>
                <label htmlFor="description" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-2 sm:px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={3}
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-purple-700 text-white py-2 px-4 text-sm sm:text-base rounded-md hover:bg-purple-800 transition-colors"
              >
                Add Event
              </button>
            </form>
          </div>

          {/* Events List Card */}
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">All Events ({allEvents.length})</h2>
            <div className="space-y-2 sm:space-y-3 max-h-96 overflow-y-auto">
              {allEvents.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No events created yet. Add your first event!</p>
              ) : (
                allEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map((event) => (
                  <div
                    key={event.id}
                    className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow"
                    style={{ borderLeftWidth: '4px', borderLeftColor: event.color || '#7e22ce' }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-base sm:text-lg text-gray-900">{event.title}</h3>
                          {event.type === 'holiday' && (
                            <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">Holiday</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          📅 {new Date(event.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                          {event.start && event.end && (
                            <span className="ml-2">
                              🕐 {new Date(event.start).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })} - {new Date(event.end).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          )}
                        </p>
                        {event.description && (
                          <p className="text-sm text-gray-700 mt-2">{event.description}</p>
                        )}
                      </div>
                      {event.type === 'user' && (
                        <button
                          onClick={() => handleDelete(event.id)}
                          className="ml-4 text-red-500 hover:text-red-700 transition-colors"
                          aria-label="Delete event"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
