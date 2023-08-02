import genericProxyHandler from "utils/proxy/handlers/generic";

const widget = {
  api: "{url}/{endpoint}",
  proxyHandler: genericProxyHandler,

  mappings: {
    system: {
      endpoint: "jn",
    },
    programs: {
      endpoint: "jp?pid=-1",
    },
  },
};

export default widget;

