import { useState, useEffect } from "react";

const useFetch = (url, options) => {
  const [dataFromApi, setDataFromApi] = useState(null);
  const [errorFromApi, setErrorFromApi] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    fetch(url, {
      
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

  return { dataFromApi, errorFromApi, isLoading };
};

export default useFetch;


