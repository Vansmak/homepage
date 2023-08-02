import useSWR from "swr";
import { useState } from "react";
import { MdLocationDisabled, MdLocationSearching } from "react-icons/md";
import { useTranslation } from "next-i18next";

import Icon from "./icon";



function Widget({ options }) {
  const { t, i18n } = useTranslation();
  const { data, error } = useSWR(
    `/api/widgets/forecast?${new URLSearchParams({ lang: i18n.language, count: 24, ...options }).toString()}`
  );

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  let highTemp = -Infinity;
  let lowTemp = Infinity;
  const forecastData = data.list.slice(1, 3); // Take the next 2 days' forecast data

  forecastData.forEach((forecast) => {
    if (forecast.main.temp_max > highTemp) {
      highTemp = forecast.main.temp_max;
    }
    if (forecast.main.temp_min < lowTemp) {
      lowTemp = forecast.main.temp_min;
    }
  });

  return (
    data && data.list ? (
      <div className="bg-theme-100/20 dark:bg-white/5 hover:bg-theme-300/20 dark:hover:bg-white/10 shadow-md shadow-theme-900/10 dark:shadow-theme-900/20 rounded-md h-15 mb-3 w-auto flex">
        <div className="flex-shrink-0 flex items-center justify-center w-11 bg-theme-500/10 dark:bg-theme-900/50 text-theme-700 hover:text-theme-700 dark:text-theme-200 text-sm font-medium rounded-l-md">
          <Icon
            condition={data.list[0].weather[0].id}
            timeOfDay={data.list[0].dt > data.list[0].sys.sunrise && data.list[0].dt < data.list[0].sys.sunset ? "day" : "night"}
            className="w-5 h-5"
          />
          <div className="text-xs text-theme-800 dark:text-theme-200">
            {t("common.number", { value: highTemp, style: "unit", unit: options.units })}↑
            {t("common.number", { value: lowTemp, style: "unit", unit: options.units })}↓
          </div>
        </div>
        <div className="flex-1 flex items-center justify-between pl-6 ml-auto py-2">
          <div className="flex flex-col">
            <div className="flex items-center">
              <p className="text-xs text-theme-800 dark:text-theme-200">
                {t("common.number", { value: data.list[0].main.temp, style: "unit", unit: options.units })}
              </p>
            </div>
            <p className="text-xs text-theme-800 dark:text-theme-200">{data.list[0].weather[0].description}</p>
          </div>
        </div>
        {forecastData.map((forecast) => (
          <div key={forecast.dt} className="flex items-center justify-center w-16">
            <Icon
              condition={forecast.weather[0].id}
              timeOfDay={forecast.dt > forecast.sys.sunrise && forecast.dt < forecast.sys.sunset ? "day" : "night"}
              className="w-5 h-5"
            />
            <div className="text-xs text-theme-800 dark:text-theme-200">
              {t("common.number", { value: forecast.main.temp_max, style: "unit", unit: options.units })}↑
              {t("common.number", { value: forecast.main.temp_min, style: "unit", unit: options.units })}↓
            </div>
          </div>
        ))}
      </div>
    ) : null
  );
}

export default function OpenWeatherMap({ options = {} }) {
  const { t } = useTranslation();
  const [location, setLocation] = useState(false);
  const [requesting, setRequesting] = useState(false);

  if (!location && options.latitude && options.longitude) {
    setLocation({ latitude: options.latitude, longitude: options.longitude });
  }

  const requestLocation = () => {
    setRequesting(true);
    if (typeof window !== "undefined") {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude });
          setRequesting(false);
        },
        () => {
          setRequesting(false);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 1000 * 60 * 60 * 3,
          timeout: 1000 * 30,
        }
      );
    }
  };

  // if (!requesting && !location) requestLocation();

  if (!location) {
    return (
      <button
        type="button"
        onClick={() => requestLocation()}
        className="flex flex-col justify-center first:ml-auto ml-4 mr-2"
      >
        <div className="flex flex-row items-center justify-end">
          <div className="hidden sm:flex flex-col items-center">
            {requesting ? (
              <MdLocationSearching className="w-6 h-6 text-theme-800 dark:text-theme-200 animate-pulse" />
            ) : (
              <MdLocationDisabled className="w-6 h-6 text-theme-800 dark:text-theme-200" />
            )}
          </div>
          <div className="flex flex-col ml-3 text-left">
            <span className="text-theme-800 dark:text-theme-200 text-sm">{t("weather.current")}</span>
            <span className="text-theme-800 dark:text-theme-200 text-xs">{t("weather.allow")}</span>
            
             </div>
             </div>
      </button>
    );
  }

  return <Widget options={{ ...location, ...options }}  />;
}