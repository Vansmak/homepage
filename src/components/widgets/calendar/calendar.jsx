import { useState, useEffect } from "react";
import { useTranslation } from "next-i18next";

import styles from '../styles.module.css'

import useFetch from "./use-fetch";
import { api, options as fetchOptions } from "./widget";



export default function DateTime({ options = {} }) {
  const { text_size: locale, format } = options;
  const { i18n } = useTranslation();
  const [date, setDate] = useState("");
 
  const dateLocale = locale ?? i18n.language;
  const [today, setToday] = useState("");

  const { dataFromApi: dodgersData } = useFetch(
    `${api}states/calendar.los_angeles_dodgers?v=${Date.now()}`,
    fetchOptions 
  );
  
  const { dataFromApi: joeData } = useFetch(
    `${api}states/calendar.joe?v=${Date.now()}`,
    fetchOptions 
  );

  let nextEvent;
  let nextEventStartTime;

  const dodgersNextEvent = dodgersData?.attributes?.message;
  const joeNextEvent = joeData?.attributes?.message;
  const dodgersEventStartTime = dodgersData?.attributes?.start_time;
  const joeEventStartTime = joeData?.attributes?.start_time;

  if (new Date(dodgersEventStartTime) < new Date(joeEventStartTime)) {
    nextEvent = dodgersNextEvent;
    nextEventStartTime = dodgersEventStartTime;
  } else {
    nextEvent = joeNextEvent;
    nextEventStartTime = joeEventStartTime;
  }


  

  useEffect(() => {
    const dateFormat = new Intl.DateTimeFormat(dateLocale, { ...format });
    const todayFormat = new Intl.DateTimeFormat(dateLocale, {
      weekday: "long",
      month: "long",
      day: "numeric",
    });

    const updateDateTime = () => {
      setDate(dateFormat.format(new Date()));
      setToday(todayFormat.format(new Date())); // Update today's date, day, and month
    };

    const interval = setInterval(updateDateTime, 1000);
    updateDateTime(); // Call the function initially to set the values immediately

    return () => clearInterval(interval);
  }, [date, setDate, today, setToday, dateLocale, format]);

  
  const eventStartDate = new Date(nextEventStartTime);
  const eventTimeFormat = { hour: "2-digit", minute: "2-digit" };

  let eventDateString = "";
  
  if (eventStartDate && !Number.isNaN(eventStartDate.getTime())) {
    const eventDate = new Date(eventStartDate);
    const todayDate = new Date();

    if (
      eventDate.toDateString() === todayDate.toDateString() ||
      (eventDate - todayDate) / (1000 * 60 * 60 * 24) === 1
    ) {
      eventDateString = "Today";
    } else if ((eventDate - todayDate) / (1000 * 60 * 60 * 24) === 2) {
      eventDateString = "Tomorrow";
    } else {
      eventDateString = eventDate.toLocaleDateString(dateLocale, {
        weekday: "long",
        month: "long",
        day: "numeric",
      });
    }
  }
  
  const eventTimeString = eventStartDate && !Number.isNaN(eventStartDate.getTime())
    ? new Intl.DateTimeFormat(dateLocale, eventTimeFormat).format(eventStartDate)
    : '';

    return (
      <div className={styles.dateContainer}>
        <div className={styles.calendarBox}>
          <div className={styles.date}>
            <span className={styles.month}>
              {new Date().toLocaleString(dateLocale, { month: 'short' })} {/* Display the current month */}
            </span>
            <span className={styles.day}>
              {new Date().getDate()} {/* Display the current day */}
            </span>
          </div>
          <div className={styles.event}>
            {nextEvent && (
              <>
                <span className="text-sm mx-2">
                    {eventDateString && ` ${eventDateString}` }: {nextEvent} {/* Display the next event and the event date */}
                </span>
                <span className="text-sm">
                  &nbsp;@ {eventTimeString} {/* Display the formatted start_time of the event */}
                </span>
              </>
            )}
          </div>
        </div>
        
       
      </div>
    );
  
    
    
}



