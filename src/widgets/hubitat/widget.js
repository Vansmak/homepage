import env from '../../../env.json';

export const api = `http://192.168.254.23/apps/api/2318/devices/2064?access_token=${env.REACT_APP_HUB_TOKEN}`;

export const options = {
  headers: {
    "Content-Type": "application/json"
  },
};

const widget = {
  // Add any additional properties needed for this widget.
};

export default widget;
