import fs from "fs";

import yaml from "js-yaml";

const widgetsConfig = yaml.load(fs.readFileSync("widgets.yaml", "utf8"));

const { apiKey } = widgetsConfig.openweathermap;


export default async function handler(req, res) {
  const { query } = req;

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?${new URLSearchParams({
        ...query,
        exclude: "minutely,hourly",
        appid: apiKey,
      })}`
    );

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
