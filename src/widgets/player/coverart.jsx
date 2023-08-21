import { useState, useEffect } from "react";

import useFetch from "./use-fetch";
import { api, options } from "./widget";

function useFetchCoverArt() {
    const url = `${api}/media_player/attributes/media_player.office`;

    const { data } = useFetch(url, options);
  
    const [coverArtUrl, setCoverArtUrl] = useState(null);
  
    useEffect(() => {
      if (data?.attributes?.entity_picture_local) {
        setCoverArtUrl(`${api}/${data.attributes.entity_picture_local}`);
      } else if (data?.attributes?.entity_picture) {
        setCoverArtUrl(`${api}/${data.attributes.entity_picture}`);
      } else {
        setCoverArtUrl(null);
      }
    }, [data]);
  
    return coverArtUrl;
  }

export default useFetchCoverArt;
