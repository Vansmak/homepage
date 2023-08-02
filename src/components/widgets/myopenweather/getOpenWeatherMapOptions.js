import fs from "fs";

import yaml from "js-yaml";

export default function handler(req, res) {
  try {
    const widgetsConfig = yaml.load(fs.readFileSync("widgets.yaml", "utf8"));
    const openweathermapOptions = widgetsConfig.openweathermap;
    res.status(200).json(openweathermapOptions);
  } catch (error) {
    res.status(500).json({ message: "Error reading widgets.yaml file." });
  }
}
