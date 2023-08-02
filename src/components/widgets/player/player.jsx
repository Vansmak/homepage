import { FaPlay, FaPause, FaVolumeUp, FaVolumeDown } from "react-icons/fa";
import { BiSkipNext } from "react-icons/bi";
import React, { useState, useEffect } from "react";
import Image from 'next/image';

import styles from '../styles.module.css'

import useFetch from "./use-fetch";
import { api, options } from "./widget";



export default function Player() {
  const { dataFromApi: mediaData } = useFetch(`${api}states/media_player.office?v=${Date.now()}`, options);

  const handlePlayPause = async () => {
    try {
      await fetch(`${api}services/media_player/media_play_pause`, {
        method: "POST",
        body: JSON.stringify({
          entity_id: "media_player.office"
        }),
        headers: {
          "Content-Type": "application/json",
          "Authorization": `${options.headers.Authorization}`
        }
      });
    } catch (error) {
      // Handle error silently
    }
  };

  const handleNextTrack = async () => {
    try {
      await fetch(`${api}services/media_player/media_next_track`, {
        method: "POST",
        body: JSON.stringify({
          entity_id: "media_player.office"
        }),
        headers: {
          "Content-Type": "application/json",
          "Authorization": `${options.headers.Authorization}`
        }
      });
    } catch (error) {
      // Handle error silently
    }
  };

  const handleVolumeUp = async () => {
    try {
      await fetch(`${api}services/media_player/volume_up`, {
        method: "POST",
        body: JSON.stringify({
          entity_id: "media_player.office"
        }),
        headers: {
          "Content-Type": "application/json",
          "Authorization": `${options.headers.Authorization}`
        }
      });
    } catch (error) {
      // Handle error silently
    }
  };
  
  const handleVolumeDown = async () => {
    try {
      await fetch(`${api}services/media_player/volume_down`, {
        method: "POST",
        body: JSON.stringify({
          entity_id: "media_player.office"
        }),
        headers: {
          "Content-Type": "application/json",
          "Authorization": `${options.headers.Authorization}`
        }
      });
    } catch (error) {
      // Handle error silently
    }
  };
  

  const artist = mediaData?.attributes?.media_artist;
  const title = mediaData?.attributes?.media_title;
  const isPlaying = mediaData?.state === "playing";
  const volume = mediaData?.attributes?.volume_level;
  const [imageUrl, setImageUrl] = useState('http://192.168.254.64:8123/local/office_media_player_picture.jpg');
  
  useEffect(() => {
    if (title && artist) {
      // Add a delay of 3 seconds (3000 milliseconds) before updating the imageUrl
      const timer = setTimeout(() => {
        setImageUrl(`http://192.168.254.64:8123/local/office_media_player_picture.jpg?t=${Date.now()}`);
      }, 3000);
  
      // Cleanup function to clear the timer when the component is unmounted or the dependencies change
      return () => {
        clearTimeout(timer);
      };
    }
  
    // Add this return statement
    return () => {};
  }, [title, artist, mediaData?.state]);
  
  
  
  

  return (
    <div className="bg-theme-100/20 dark:bg-white/5 hover:bg-theme-300/20 dark:hover:bg-white/10 shadow-md shadow-theme-900/10 dark:shadow-theme-900/20 rounded-md h-24 mb-3" style={{ marginTop: "40px" }}> {/* Add marginTop style here */}
    <div className="flex h-full">
      <div className="flex-shrink-0 relative w-20 h-full">
        <Image
          src={imageUrl}
          alt="Cover Art"
          layout="fill"
          objectFit="cover"
          className="rounded-l-md"
          key={imageUrl}
        />
      </div>
      <div className="flex-1 flex items-center justify-between rounded-r-md pl-3 py-2" style={{ maxWidth: "600px" }}>
  <div className="flex flex-col">
    <p className={styles.truncate}>
      {artist && title ? `${artist} - ${title}` : "No media playing"}
    </p>

            <div className="flex flex-row mt-2">
              <button type="button" onClick={handlePlayPause} className="mr-10 text-theme-800 dark:text-theme-200">
                {isPlaying ? <FaPause /> : <FaPlay />}
              </button>
              <button type="button" onClick={handleNextTrack} className="mr-10 text-theme-800 dark:text-theme-200">
                <BiSkipNext />
              </button>
              <div className="flex items-center mr-10 text-theme-800 dark:text-theme-200">
  <button type="button" onClick={handleVolumeDown} className="mr-2 text-theme-800 dark:text-theme-200">
    <FaVolumeDown />
  </button>
  {volume}
  <button type="button" onClick={handleVolumeUp} className="ml-2 text-theme-800 dark:text-theme-200">
    <FaVolumeUp />
  </button>
</div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
