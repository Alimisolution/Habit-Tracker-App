import { useAuth } from "@/lib/auth-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { Button, Text, TextInput, useTheme } from 'react-native-paper';

export default function AuthScreen(){
    const [isSignUp, setIsSignUp] = useState<boolean>(false)
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [error, setError] = useState<string | null>('')

    const theme = useTheme();
    const router = useRouter();
    const {signIn, signUp} = useAuth();

    const handleAuth = async () =>{
        if(!email || !password) {
            setError('Please fill in all fields!')
            return; 
        }

        if(password.length < 6){
            setError('Password must be at least 6 character long!')
            return;
        }

        setError(null);

        if(isSignUp){
         const error = await signUp(email, password)
            if(error){
                setError(error)
                return;
            }
        }else{
             const error = await signIn(email, password)
            if(error){
                setError(error)
                return;
            }

            router.replace('/')
        }
    }

    const handleSwitchMode = () => {
        setIsSignUp(prev => !prev)
    }

    return(
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title} variant="headlineMedium">{isSignUp ? 'Create Account' : 'Welcome Back!'}</Text>

                <TextInput style={styles.input} mode="outlined" label='Email' autoCapitalize="none"
                keyboardType="email-address" placeholder="example@gmail.com" onChangeText={setEmail}/>

                <TextInput style={styles.input} mode="outlined" label='Password' autoCapitalize="none"
                secureTextEntry onChangeText={setPassword}/>
                {error && (<Text style={{color: theme.colors.error}}>{error}</Text> )}

                <Button onPress={handleAuth} style={styles.btn} mode="contained">{isSignUp ? 'Sign Up' : 'Sign In'}</Button>
                <Button style={styles.switchBtn} onPress={handleSwitchMode} mode="text">{isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}</Button>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5'
    },
    content: {
        flex: 1,
        padding: 20,
        justifyContent: 'center'
    },
    title: {
        textAlign: 'center',
        marginBottom: 24,
    },
    input: {
        marginBottom: 16,
    },
    btn: {
        marginTop: 12,
    },
    switchBtn: {
        marginTop: 16
    }
})