// src/contexts/SurveyContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const SurveyContext = createContext();

export function useSurveyData() {
  return useContext(SurveyContext);
}

export function SurveyProvider({ children }) {
  const [dailyInfo, setDailyInfo] = useState([]);
  const [weeklyInfo, setWeeklyInfo] = useState([]);
  const patientId = localStorage.getItem("patientId");

  useEffect(() => {
    const fetchDaily = async () => {
      const res = await fetch(`/daily-surveys/${patientId}`);
      const data = await res.json();
      setDailyInfo(data.sort((a, b) => new Date(a.date) - new Date(b.date)));
    };
    fetchDaily();
  }, [patientId]);

  useEffect(() => {
    const fetchWeekly = async () => {
      const res = await fetch(`/weekly-surveys/${patientId}`);
      const data = await res.json();
      setWeeklyInfo(data);
    };
    fetchWeekly();
  }, [patientId]);

  return (
    <SurveyContext.Provider value={{ dailyInfo, weeklyInfo }}>
      {children}
    </SurveyContext.Provider>
  );
}
