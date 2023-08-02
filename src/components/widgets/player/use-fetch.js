import { useState, useEffect } from "react";

const useFetch = (url, options) => {
  const [dataFromApi, setDataFromApi] = useState(null);
  const [errorFromApi, setErrorFromApi] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const sendCommand = async (command) => {
    setIsLoading(true);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          ...options.headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          service: command
        })
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      setIsLoading(false);
    } catch (error) {
      setErrorFromApi(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);

    fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Content-Type': 'application/json'
      }
    })
      .then((response) => response.json())
      .then((data) => {
        setDataFromApi(data);
        setIsLoading(false);
      })
      .catch((error) => {
        setErrorFromApi(error);
        setIsLoading(false);
      });
  }, [url, options]);

  return { dataFromApi, errorFromApi, isLoading, sendCommand };
};

export default useFetch;



