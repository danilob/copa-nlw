import {VStack, Heading, useToast} from "native-base";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useState } from "react";
import { api } from "../services/api";
import { useNavigation } from "@react-navigation/native";

export function Find(){
	const [isLoading, setIsLoading] = useState(false);
	const [code, setCode] = useState('')
	const toast = useToast();
	const {navigate} = useNavigation()

	async function handleJoinPool(){
		try {
			
			if(!code.trim()){
				// Alert.alert('Novo bolão!','Informe um nome para o seu bolão')
				return toast.show({
					title: "Informe um código",
					placement: "top",
					bgColor: 'red.500'
				})
			}
			if(code.trim().length!=6){
				// Alert.alert('Novo bolão!','Informe um nome para o seu bolão')
				return toast.show({
					title: "Seis é o número máximo de caracteres para o código.",
					placement: "top",
					bgColor: 'red.500'
				})
			}
			setIsLoading(true)
			await api.post('/pools/join',{code})
			toast.show({
				title: "Você entrou no bolão com sucesso!",
				placement: "top",
				bgColor: 'green.500'
			})
			navigate('pools')
		} catch (error) {
			setIsLoading(false)
			toast.show({
				title: `Não foi possível encontrar o bolão: ${error.response?.data?.message}`,
				placement: "top",
				bgColor: 'red.500'
			})
		}
	}

	return (
		<VStack flex={1} bgColor="gray.900">
			<Header title="Buscar por Código" showBackButton></Header>
			<VStack mt={8} mx={5} alignItems="center">
				
				<Heading fontFamily="heading" color="white" fontSize="xl" mb={8} textAlign="center">
					Encontre um bolão através de{'\n'} seu código único
				</Heading>
				<Input
					mb={2}
					placeholder="Qual o nome do seu bolão?"
					onChangeText={setCode}
					autoCapitalize="characters"
					value={code}
				/>
				<Button
					title="Buscar bolão"
					isLoading={isLoading}
					onPress={handleJoinPool}
				/>
			</VStack>
		</VStack>
	)
}