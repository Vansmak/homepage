import dynamic from "next/dynamic";

import ErrorBoundary from "components/errorboundry";

const widgetMappings = {
  weatherapi: dynamic(() => import("components/widgets/weather/weather")),
  openweathermap: dynamic(() => import("components/widgets/openweathermap/weather")),
  resources: dynamic(() => import("components/widgets/resources/resources")),
  search: dynamic(() => import("components/widgets/search/search")),
  greeting: dynamic(() => import("components/widgets/greeting/greeting")),
  datetime: dynamic(() => import("components/widgets/datetime/datetime")),
  logo: dynamic(() => import("components/widgets/logo/logo"), { ssr: false }),
  unifi_console: dynamic(() => import("components/widgets/unifi_console/unifi_console")),
  glances: dynamic(() => import("components/widgets/glances/glances")),
  openmeteo: dynamic(() => import("components/widgets/openmeteo/openmeteo")),
  longhorn: dynamic(() => import("components/widgets/longhorn/longhorn")),
  kubernetes: dynamic(() => import("components/widgets/kubernetes/kubernetes")),
  player: dynamic(() => import("components/widgets/player/player")),
  quote: dynamic(() => import("components/widgets/quote/quote")),
  myopenweather: dynamic(() => import("components/widgets/myopenweather/weather")),
  calendar: dynamic(() => import("components/widgets/calendar/calendar")),
};

export default function Widget({ widget }) {
  const InfoWidget = widgetMappings[widget.type];

  if (InfoWidget) {
    return (
      <ErrorBoundary>
        <InfoWidget options={widget.options} />
      </ErrorBoundary>
    );
  }

  return (
    <div className="flex-none flex flex-row items-center justify-center">
      Missing <strong>{widget.type}</strong>
    </div>
  );
}
