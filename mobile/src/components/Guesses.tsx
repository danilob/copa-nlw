import { Box, FlatList } from 'native-base';
import { useRoute } from "@react-navigation/native";
import { HStack, useToast, VStack } from "native-base";
import { Loading } from "../components/Loading";
import { useEffect, useState } from "react";
import { api } from "../services/api";
import {Game, GameProps} from '../components/Game'
import { EmptyMyPoolList } from './EmptyMyPoolList';
import { Share } from 'react-native';
interface Props {
  poolId: string;
  code: string;
}

export function Guesses({ poolId, code }: Props) {
  const [isLoading,setIsLoading] = useState(true)
  const [games,setGames] = useState<GameProps>([])
  const [firstTeamPoints, setFirstTeamPoints] = useState('')
  const [secondTeamPoints, setSecondTeamPoints] = useState('')
	const route = useRoute()
	const toast = useToast();

  async function handleCodeShare(){
		await Share.share({
			message: code
		})
	}

  async function fetchGames(){
    try {
      setIsLoading(true)
      const response = await api.get(`/pools/${poolId}/games`)
      //console.log(response.data.games)
      setGames(response.data.games)
    } catch (error) {
			toast.show({
				title: `Não foi possível carregar os jogos: ${error}`,
				placement: "top",
				bgColor: 'red.500'
			})
		} finally{
			setIsLoading(false)
		}
  }

  async function handleGuessConfirm(gameId: string){
    try {
      if(!firstTeamPoints.trim() || !secondTeamPoints.trim()){
        return toast.show({
          title: `Informe o placar do palpite`,
          placement: "top",
          bgColor: 'red.500'
        })
      }
      await api.post(`/pools/${poolId}/games/${gameId}/guesses`,{
        firstTeamPoints: Number(firstTeamPoints),
        secondTeamPoints: Number(secondTeamPoints),
      })
      fetchGames();
      return toast.show({
        title: `Palpite realizado com sucesso!`,
        placement: "top",
        bgColor: 'green.500'
      })

      
    } catch (error) {
			toast.show({
				title: `Não foi possível enviar o palpite: ${error}`,
				placement: "top",
				bgColor: 'red.500'
			})
		} 
  }

  useEffect(()=>{
    fetchGames()
  },[poolId])

  if(isLoading){
    return(
      <Loading/>
    )
  }

  return (
    <FlatList
      data={games}
      keyExtractor={item => item.id}
      renderItem={({item})=>(
        <Game 
          data={item}
          setFirstTeamPoints={setFirstTeamPoints}
          setSecondTeamPoints={setSecondTeamPoints}
          onGuessConfirm={()=>handleGuessConfirm(item.id)}
          closed = {item.guess?.firstTeamPoints>=0 && item.guess?.secondTeamPoints>=0}
        />
      )
      }
      _contentContainerStyle={{pb:10}}
      ListEmptyComponent={()=><EmptyMyPoolList code={code} onShare={handleCodeShare}/>}
    ></FlatList>
  );
}
