import { useTranslation } from "next-i18next";

import Container from "components/services/widget/container";
import Block from "components/services/widget/block";
import useWidgetAPI from "utils/proxy/use-widget-api";

export default function OpenSprinklerStats({ service }) {
  const { t } = useTranslation();
  const { widget } = service;

  const { data: systemData, error: systemError } = useWidgetAPI(widget, "system");

  if (systemError) {
    return <Container error={systemError} />;
  }

  if (!systemData) {
    return (
      <Container service={service}>
        <Block label={t("Status")} />
      </Container>
    );
  }

  const { masop, snames } = systemData;

  // Function to check if any station is running
  const isAnyStationRunning = () => masop.some(status => status !== 254);

  // Function to get the name of the running station
  const getRunningStationName = () => {
    const runningStationIndex = masop.findIndex(status => status !== 254);
    if (runningStationIndex !== -1) {
      return snames[runningStationIndex];
    }
    return "";
  };

  return (
    <Container service={service}>
      <Block label={t("Status")} value={isAnyStationRunning() ? `Running station: ${getRunningStationName()}` : "Idle"} />
    </Container>
  );
}
