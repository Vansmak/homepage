import { useTranslation } from "next-i18next";

import Container from "components/services/widget/container";
import Block from "components/services/widget/block";
import useWidgetAPI from "utils/proxy/use-widget-api";

export default function Component({ service }) {
  const { t } = useTranslation();

  const { widget } = service;

  const { data: printStats, error: printStatsError } = useWidgetAPI(widget, "print_stats");
  const { data: displayStatus, error: displayStatsError } = useWidgetAPI(widget, "display_status");
  const { data: webHooks, error: webHooksError } = useWidgetAPI(widget, "webhooks");

  if (printStatsError || displayStatsError || webHooksError) {
    const finalError = printStatsError ?? displayStatsError ?? webHooksError;
    return <Container service={service} error={finalError} />;
  }

  if (!printStats || !displayStatus || !webHooks) {
    return (
      <Container service={service}>
        <Block label="moonraker.printer_state" />
      </Container>
    );
  }

  if (webHooks.result.status.webhooks.state === "shutdown") {
    return (
      <Container service={service}>
        <Block label="moonraker.printer_state" value={webHooks.result.status.webhooks.state} />
      </Container>
    );
  }

  let currentLayer = "-";
  let totalLayer = "-";
  if (printStats.result.status.print_stats.info.total_layer !== null) {
    currentLayer = printStats.result.status.print_stats.info.current_layer;
    totalLayer = printStats.result.status.print_stats.info.total_layer;
  }

  return (
    <Container service={service}>
      <Block label="moonraker.layers" value={`${currentLayer} / ${totalLayer}`} />
      <Block label="moonraker.print_progress" value={t("common.percent", { value: (displayStatus.result.status.display_status.progress * 100) })} />
      {/* Change "moonraker.print_status" label to "status" */}
      <Block label="status" value={printStats.result.status.print_stats.state} labelValue="Status" />
    </Container>
  );
  
  
}
