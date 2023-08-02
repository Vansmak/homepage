import { useTranslation } from "next-i18next";

import Container from "components/services/widget/container";
import Block from "components/services/widget/block";
import useWidgetAPI from "utils/proxy/use-widget-api";

export default function Component({ service }) {
  const { t } = useTranslation();

  const { widget } = service;

  const { data: pialertData, error: pialertError } = useWidgetAPI(widget, "data");

  if (pialertError) {
    return <Container service={service} error={pialertError} />;
  }

  if (!pialertData) {
    return (
      <Container service={service}>
        <Block label="total" />
        <Block label="connected" />
        <Block label="new_devices" />
        <Block label="down_alerts" />
      </Container>
    );
  }

  return (
    <Container service={service}>
      <Block label="total" value={t("common.number", { value: parseInt(pialertData[0], 10) })} />
      <Block label="connected" value={t("common.number", { value: parseInt(pialertData[1], 10) })} />
      <Block label="new_devices" value={t("common.number", { value: parseInt(pialertData[3], 10) })} />
      
    </Container>
  );
}
