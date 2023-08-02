import { useTranslation } from "next-i18next";

import useFetch from "./use-fetch";
import { api, options } from "./widget";

import Block from "components/services/widget/block";
import Container from "components/services/widget/container";

export default function Component() {
  const { t } = useTranslation();
  const { dataFromApi: devicesData, errorFromApi: devicesError, isLoading: devicesIsLoading } = useFetch(`${api}`, options);

  if (devicesIsLoading) {
    return <Container />;
  }

  if (devicesError) {
    return <Container error={devicesError} />;
  }

 
  const hubAlerts = devicesData?.attributes.find(attr => attr.name === "hubAlerts")?.currentValue;
  const updatesAvailable = hubAlerts === "[platformUpdateAvailable]" ? "Yes" : "No";
 
  const uptimeInSeconds = devicesData?.attributes.find(attr => attr.name === "uptime")?.currentValue;

// Convert the uptime value to days
const uptimeInDays = Math.round(uptimeInSeconds / 86400); // There are 86400 seconds in a day

const uptimeLabel = `${uptimeInDays} ${t("common:days")}`;



return (
  <Container>
    <Block label={t("common:uptime")} value={uptimeLabel} />
    <Block label={t("common:updates")} value={updatesAvailable} />
    <Block label={t("common:zigbee")} value={devicesData?.attributes.find(attr => attr.name === "zigbeeStatus2")?.currentValue} />
    <Block label={t("common:zwave")} value={devicesData?.attributes.find(attr => attr.name === "zwaveStatus")?.currentValue} />
  </Container>
);

 
}





