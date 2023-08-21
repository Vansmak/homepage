import { FaPlay, FaPause, FaVolumeUp, FaVolumeDown } from "react-icons/fa";
import { BiSkipNext } from "react-icons/bi";
import React, { useState, useEffect } from "react";
import Image from 'next/image';

import styles from './styles.module.css'
import useFetch from "./use-fetch";
import { api, options } from "./widget";



export default function Player() {
  const { dataFromApi: mediaData } = useFetch(`${api}states/media_player.office?v=${Date.now()}`, options);

  const isPlaying = mediaData?.state === "playing"; // Define isPlaying based on media player state

  const handlePlayPause = async () => {
    try {
      await fetch("http://192.168.254.64:8123/api/webhook/play_pause_media_webhook", {
        method: "POST",
        body: JSON.stringify({
          action: isPlaying ? "pause" : "play"
        }),
        headers: {
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      // Handle error silently
    }
  }
  const handleNextTrack = async () => {
    try {
      await fetch("http://192.168.254.64:8123/api/webhook/next_track_media_webhook", {
        method: "POST",
        body: JSON.stringify({}),
        headers: {
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      // Handle error silently
    }
  };
  
  const handleVolumeUp = async () => {
    try {
      await fetch("http://192.168.254.64:8123/api/webhook/volume_up_media_webhook", {
        method: "POST"
      });
    } catch (error) {
      // Handle error silently
    }
  };
  
  const handleVolumeDown = async () => {
    try {
      await fetch("http://192.168.254.64:8123/api/webhook/volume_down_media_webhook", {
        method: "POST"
      });
    } catch (error) {
      // Handle error silently
    }
  };
  
  
  

  const artist = mediaData?.attributes?.media_artist;
  const title = mediaData?.attributes?.media_title;
  
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
    <div className="h-[86px]" style={{ marginTop: "-12px" }}>
      <div className="flex h-full">
        <div className="flex-shrink-0 relative w-20 h-full">
          <Image
            src={imageUrl}
            alt="Cover Art"
            layout="fill"
            objectFit="cover"
            className="rounded-l-md"
            key={imageUrl}
            style={{ marginTop: "-10px" }}
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
