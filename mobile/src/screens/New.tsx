import {VStack, Heading, Text, useToast} from "native-base";
import { useState } from "react";
import { Header } from "../components/Header";
import Logo from '../assets/logo.svg'
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { api } from "../services/api";
// import { Alert } from "react-native";

export function New(){
	const [title, setTitle] = useState('')
	const [isLoading, setIsLoading] = useState(false)

	const toast = useToast()

	async function handlePoolCreate(){
		if(!title.trim()){
			// Alert.alert('Novo bolão!','Informe um nome para o seu bolão')
			return toast.show({
				title: "Informe um nome para o seu bolão",
				placement: "top",
				bgColor: 'red.500'
			})
		}
		try {
			setIsLoading(false)
			await api.post('/pools', {title: title.toUpperCase()})
			toast.show({
				title: "Bolão criado com sucesso",
				placement: "top",
				bgColor: 'green.500'
			})
			setTitle('')
		} catch (error) {
			toast.show({
				title: `Não foi possível criar o bolão: ${error}`,
				placement: "top",
				bgColor: 'red.500'
			})
			
		} finally{
			setIsLoading(false)
		}
		
	}

	return (
		<VStack flex={1} bgColor="gray.900">
			<Header title="Criar novo bolão"></Header>
			<VStack mt={8} mx={5} alignItems="center">
				<Logo />
				<Heading fontFamily="heading" color="white" fontSize="xl" my={8} textAlign="center">
					Crie seu próprio bolão da copa {'\n'} e compartilhe entre amigos!
				</Heading>
				<Input
					mb={2}
					placeholder="Qual o nome do seu bolão?"
					onChangeText={setTitle}
					value = {title}
				/>
				<Button
					title="Criar meu bolão"
					onPress={handlePoolCreate}
					isLoading={isLoading}
				/>
				<Text color="gray.200" fontSize="sm"  textAlign="center" px={8} mt={4}>
				Após criar seu bolão, você receberá um {'\n'}código único que poderá usar para convidar{'\n'} outras pessoas.
				</Text>
			</VStack>
		</VStack>
	)
}