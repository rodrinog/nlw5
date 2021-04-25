import { createContext, ReactNode, useContext, useState } from 'react';

type Episode = {
  title: string;
  members: string;
  thumbnail: string;
  duration: number;
  url: string;
};

type PlayerContextData = {
  episodeList: Episode[];
  currentEpisodeIndex: number; //para indicar qual posição do array de Episode está tocando atualmente
  isPlaying: boolean;
  isLooping: boolean;
  isShuffling: boolean;
  isNormalSpeed: boolean;
  play: (episode: Episode) => void;
  playList: (list: Episode[], index: number) => void;
  playNext: () => void;
  playPrevious: () => void;
  togglePlay: () => void;
  toggleLoop: () => void;
  toggleShuffle: () => void;
  toggleSpeed: () => void;
  setPlayingState: (state: boolean) => void;
  hasNext: boolean;
  hasPrevious: boolean;
  clearPlayerState: () => void;
};

// export const PlayerContext = createContext({
//   episodeList: [],
//   currentEpisodeIndex: 0,
// }); //passando como parametro a estrutura do objeto, ou:

export const PlayerContext = createContext({} as PlayerContextData);

type PlayerContextProviderProps = {
  children: ReactNode;
}

export function PlayerContextProvider({children}: PlayerContextProviderProps){
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [isNormalSpeed, setIsNormalSpeed] = useState(true);

  function play(episode: Episode){
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }
  function playList(list: Episode[], index: number){
    setEpisodeList(list);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);
  }
  function togglePlay(){
    setIsPlaying(!isPlaying);
  }
  function toggleLoop(){
    setIsLooping(!isLooping);
  }
  function toggleShuffle(){
    setIsShuffling(!isShuffling);
  }
  function toggleSpeed(){
    setIsNormalSpeed(!isNormalSpeed);
  }
  function setPlayingState(state: boolean){
    setIsPlaying(state);
  }
  const hasPrevious = currentEpisodeIndex > 0;
  const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length;

  function playNext(){
    if (isShuffling){
      const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length)
      setCurrentEpisodeIndex(nextRandomEpisodeIndex);
    } else if (hasNext){
      setCurrentEpisodeIndex(currentEpisodeIndex + 1);
    }
  }
  function playPrevious(){
    if (hasPrevious){
      setCurrentEpisodeIndex(currentEpisodeIndex - 1);
    }
  }
  function clearPlayerState(){
    setEpisodeList([]);
    setCurrentEpisodeIndex(0);
  }
  return (    // neste momento criamos um contexto que recebe seus metodos no value
    <PlayerContext.Provider 
      value={{
        episodeList, 
        currentEpisodeIndex, 
        play,
        playList,
        playPrevious,
        playNext,
        isPlaying,
        isLooping,
        isShuffling,
        togglePlay, 
        toggleLoop,
        toggleShuffle,
        setPlayingState,
        hasNext,
        hasPrevious,
        clearPlayerState,
        isNormalSpeed,
        toggleSpeed
      }}
    >

      {children}

    </PlayerContext.Provider>
  )
}

export const usePlayer = () => {
  return useContext(PlayerContext);
}
