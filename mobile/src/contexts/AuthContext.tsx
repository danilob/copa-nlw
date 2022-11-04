import { createContext, ReactNode, useState} from "react";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import * as Google from 'expo-auth-session/providers/google';
import { useEffect } from "react";
WebBrowser.maybeCompleteAuthSession();

interface UserProps{
	name: string;
	avatarUrl: string;
}

export interface AuthContextDataProps{
	user: UserProps;
	isUserLoading: boolean;
	signIn: () => Promise<void>;
}

interface AuthProviderProps{
	children: ReactNode
}


export const AuthContext = createContext({} as AuthContextDataProps);

export function AuthContextProvider({children}: AuthProviderProps){
	
	const [isUserLoading,setIsUserLoading] = useState(false);
	const [user, setUser] = useState<UserProps>({} as UserProps)
	
	const [request, response, promptAsync] = Google.useAuthRequest({
		clientId: '596705280175-ce7spknke4hptj73tgg1fhsr1n2hiflg.apps.googleusercontent.com',
		redirectUri: AuthSession.makeRedirectUri({useProxy: true}), 
		scopes: ['profile','email']
	})
	
	async function signIn(){
		try {
			setIsUserLoading(true)
			await promptAsync();
		} catch (error) {
			console.log(error);
			throw error;
		} finally{
			setIsUserLoading(false)
		}

		
	}

	async function signWithGoogle(access_token: string){
		console.log("Token de autenticação ==>", access_token)
	}

	useEffect(()=>{
		if(response?.type === 'success' && response.authentication?.accessToken){
			signWithGoogle(response.authentication.accessToken)
		}
	},[response])

	return(
		<AuthContext.Provider value={{
			signIn,
			isUserLoading,
			user
		}}>
			{children}
		</AuthContext.Provider>
	);
}