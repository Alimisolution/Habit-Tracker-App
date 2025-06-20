import { database, DATABASE_ID, HABIT_COLLECTION_ID } from "@/lib/appwrite";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { ID } from "react-native-appwrite";
import { Button, SegmentedButtons, Text, TextInput, useTheme } from "react-native-paper";

const FREQUENCY = ['daily', 'weekly', 'monthly']

type FrequencyType = (typeof FREQUENCY)[number]

export default function AddHabitScreen(){
    const [title,setTitle] = useState<string>('')
    const [description,setDescription] = useState<string>('')
    const [frequency,setFrequency] = useState<FrequencyType>('daily')
    const [error,setError] = useState<string>('')


    const {user} = useAuth();
    const router = useRouter();
    const theme = useTheme();

    const handleAddHabit = async () => {
        if(!user) return;

        try {
            
            await database.createDocument(DATABASE_ID, HABIT_COLLECTION_ID, ID.unique(), 
            {user_id: user.$id, title, description, frequency, streak_count: 0, last_completed: new Date().toISOString(), created_at: new Date().toISOString()})
        router.back();
        } catch (error) {
            if(error instanceof Error){
                setError(error.message)
                return;
            }
            setError('There was an error creating the habit')
        }
    }

    return(
        <View style={style.container} >
            <TextInput label='Title' mode="outlined" style={style.input} onChangeText={setTitle} />
            <TextInput label='Description' mode="outlined" style={style.input} onChangeText={setDescription} />
            <View style={style.frequencyContainer}>
                <SegmentedButtons value={frequency} onValueChange={(value) => setFrequency(value as FrequencyType)} buttons={FREQUENCY.map(freq => ({
                value: freq,
                label: freq.charAt(0).toUpperCase() + freq.slice(1),
                }))}/>
            </View>
            <Button mode="contained" onPress={handleAddHabit} disabled={!title || !description}>Add Habit</Button>
            {error && <Text style={{color: theme.colors.error}}>{error}</Text>}
        </View>
    );
}


const style = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center'
    },
    input: {
        marginBottom: 10
    },
    frequencyContainer: {
        marginBottom: 24
    },
})