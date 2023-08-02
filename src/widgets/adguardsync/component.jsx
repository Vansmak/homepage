import { useTranslation } from "next-i18next";

import Container from "components/services/widget/container";
import Block from "components/services/widget/block";
import useWidgetAPI from "utils/proxy/use-widget-api";

export default function Component({ service }) {
  const { t } = useTranslation();
  const { widget } = service;

  const { data: adguardData1, error: adguardError1 } = useWidgetAPI(widget, "stats");
  const { data: adguardData2, error: adguardError2 } = useWidgetAPI({
    ...widget,
    url: "http://192.168.254.66", // replace with the URL of the second AdGuard Home instance
  }, "stats");

  if (adguardError1 || adguardError2) {
    return <Container error={adguardError1 || adguardError2} />;
  }

  if (!adguardData1 && !adguardData2) {
    return (
      <Container service={service}>
        <Block label="adguard.queries" />
        <Block label="adguard.blocked" />
        <Block label="adguard.filtered" />
        <Block label="adguard.latency" />
      </Container>
    );
  }

  const adguardData = {
    num_dns_queries: (adguardData1?.num_dns_queries ?? 0) + (adguardData2?.num_dns_queries ?? 0),
    num_blocked_filtering: (adguardData1?.num_blocked_filtering ?? 0) + (adguardData2?.num_blocked_filtering ?? 0),
    num_replaced_safebrowsing: (adguardData1?.num_replaced_safebrowsing ?? 0) + (adguardData2?.num_replaced_safebrowsing ?? 0),
    num_replaced_safesearch: (adguardData1?.num_replaced_safesearch ?? 0) + (adguardData2?.num_replaced_safesearch ?? 0),
    num_replaced_parental: (adguardData1?.num_replaced_parental ?? 0) + (adguardData2?.num_replaced_parental ?? 0),
    avg_processing_time: ((adguardData1?.avg_processing_time ?? 0) + (adguardData2?.avg_processing_time ?? 0)) / 2,
  };

  const filtered =
    adguardData.num_replaced_safebrowsing + adguardData.num_replaced_safesearch + adguardData.num_replaced_parental;

  return (
    <Container service={service}>
      <Block label="adguard.queries" value={t("common.number", { value: adguardData.num_dns_queries })} />
      <Block label="adguard.blocked" value={t("common.number", { value: adguardData.num_blocked_filtering })} />
      <Block label="adguard.filtered" value={t("common.number", { value: filtered })} />
      
    </Container>
  );
}
