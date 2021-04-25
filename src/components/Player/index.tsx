import Image from 'next/image';
import { useRef, useEffect, useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import { usePlayer } from '../../contexts/PlayerContext';
import styles from './styles.module.scss';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

export function Player(){
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);
  const playbackRate = 1;

  const {
    episodeList, 
    currentEpisodeIndex, 
    isPlaying, 
    togglePlay,
    setPlayingState,
    playNext,
    playPrevious,
    hasNext,
    hasPrevious,
    isLooping,
    toggleLoop,
    isShuffling,
    toggleShuffle,
    isNormalSpeed,
    toggleSpeed,
    clearPlayerState
  } = usePlayer();

  useEffect(() => {
    if (!audioRef.current){
      return; 
    }
    if (isPlaying){
      if (isNormalSpeed){
        audioRef.current.playbackRate = 1
      } else {
        audioRef.current.playbackRate = 2
        }
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying])

  function setupProgressListener(){
    audioRef.current.currentTime = 0;

    audioRef.current.addEventListener('timeupdate', () =>{
      setProgress(Math.floor(audioRef.current.currentTime));
    });
  }

  function handleSeek(amount: number){
    audioRef.current.currentTime = amount;
    setProgress(amount);
  }
  function handleEpisodeEnded(){
    if (hasNext){
      playNext()
    } else  {
      clearPlayerState()
    }
  }

  const episode = episodeList[currentEpisodeIndex]
  
  return(
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" alt="Tocando agora" />
        <strong>Tocando agora</strong>
      </header>
      
      {episode ? (
        <div className={styles.currentEpisode}>
          <Image 
          width={592}
          height={592}
          src={episode.thumbnail}
          objectFit="cover"
          />
          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
        <strong>Selecione um podcast para ouvir</strong>
      </div>
      )}

      <footer className={!episode ? styles.empty : ''}>
        <div className={styles.progress}>
          <span>{convertDurationToTimeString(progress)}</span>
          <div className={styles.slider}>
            {episode ? (
              <Slider
                max={episode.duration}
                value={progress}
                onChange={handleSeek}
                trackStyle={{ backgroundColor: '#04D361'}}
                railStyle={{ backgroundColor: '#9F75FF'}}
                handleStyle={{borderColor:'#04D361', borderWidth: 4}}
               />
            ) : (
              <div className={styles.emptySlider} />
            )}
          </div>
          <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
          {/* ponto de interrogação garante se o episódio não existir não acessa a propriedade duração */}
        </div>

        {episode && (
          <audio
          src={episode.url}
          ref={audioRef}
          loop={isLooping}
          autoPlay
          onPlay={() => setPlayingState(true)}
          onPause={() => setPlayingState(false)}
          onLoadedMetadata={setupProgressListener}
          onEnded={handleEpisodeEnded}
          
          />
        )} 

        <div className={styles.buttons}>
          <button 
            type="button" 
            disabled={!episode || episodeList.length === 1}
            onClick={toggleShuffle}
            className={isShuffling ? styles.isActive : ''}>
            <img src="/shuffle.svg" alt="Embaralhar" />
          </button>
          <button type="button" onClick={playPrevious} disabled={!episode || !hasPrevious}>
            <img src="/play-previous.svg" alt="Tocar anterior" />
          </button>
          <button 
            type="button" 
            className={styles.playButton} 
            disabled={!episode}
            onClick={togglePlay}
            >
            { isPlaying
              ? <img src="/pause.svg" alt="Pausar" />
              : <img src="/play.svg" alt="Tocar" />
            }
          </button>
          <button type="button" onClick={playNext} disabled={!episode || !hasNext}>
            <img src="/play-next.svg" alt="Tocar próxima" />
          </button>
          <button 
            type="button" 
            disabled={!episode}
            onClick={toggleLoop}
            className={isLooping ? styles.isActive : ''}
          >
            <img src="/repeat.svg" alt="Repetir" />
          </button>
          <div hidden={!episode} onClick={toggleSpeed}>
              { isNormalSpeed ?
                <strong>1x</strong>
              :
                <strong>2x</strong>
              }
          </div>
        </div>
      </footer>
    </div>
  );
}