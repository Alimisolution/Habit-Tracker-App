import { client, COMPLETIONS_COLLECTION_ID, database, DATABASE_ID, HABIT_COLLECTION_ID, RealTimeResponse } from "@/lib/appwrite";
import { useAuth } from "@/lib/auth-context";
import { CompletedHabits, Habit } from "@/types/database.type";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { ID, Query } from "react-native-appwrite";
import { Swipeable } from "react-native-gesture-handler";
import { Button, Surface, Text } from "react-native-paper";

export default function HomeScreen() {
 const [habits,setHabits] = useState<Habit[]>([]);
 const [completedHabits, setCompletedtHabits] = useState<string[]>([])

  const {signOut, user} = useAuth();
  const swipeableRef = useRef<{ [key: string] : Swipeable | null }>({})



 useEffect(() =>{
    if(user){
      const HabitsChannel =  `databases.${DATABASE_ID}.collections.${HABIT_COLLECTION_ID}.documents`;
      const habitSubscription =  client.subscribe(
       HabitsChannel,
      (response: RealTimeResponse) => {
           if(response.events.includes('databases.*.collections.*.documents.*.create')){
            handleFetchHabit();
          } else if (response.events.includes('databases.*.collections.*.documents.*.update')){
             handleFetchHabit();
           } else if (response.events.includes('databases.*.collections.*.documents.*.delete')){
             handleFetchHabit();
           }
      }
    )


      const completionChannel =  `databases.${DATABASE_ID}.collections.${COMPLETIONS_COLLECTION_ID}.documents`;
      const completionSubscription =  client.subscribe(
       completionChannel,
      (response: RealTimeResponse) => {
           if(response.events.includes('databases.*.collections.*.documents.*.create')){
            handleFetchTodayCompletedHabit();
           }
      }
    )

      handleFetchHabit();
      handleFetchTodayCompletedHabit();

      return () => {
        habitSubscription();
        completionSubscription();
      }
    }
    
  }, [user])



 const handleFetchHabit = async () => {
  try {
    const res = await database.listDocuments(
      DATABASE_ID, HABIT_COLLECTION_ID, 
      [Query.equal('user_id', user?.$id ?? '')]
    )
    setHabits(res.documents as Habit[])
  } catch (error) {
    console.log(error)
  }
  }


  const handleFetchTodayCompletedHabit = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const res = await database.listDocuments(
      DATABASE_ID, COMPLETIONS_COLLECTION_ID,
      [Query.equal('user_id', user?.$id ?? ''), Query.greaterThanEqual('completed_at', today.toISOString())]
    )
    const habitCompleteion = res.documents as CompletedHabits[]
    setCompletedtHabits(habitCompleteion.map(h => h.habit_id ))
  } catch (error) {
    console.log(error)
  }
  }
  

  const renderRightActions = (habitId: string) => (
    <View style={style.SwipeRightAction}>
      {isHabitCompleted(habitId) ? <Text style={{color: '#fff'}}>Completed</Text>
      :<MaterialCommunityIcons name="check-circle-outline" size={30} color={'#fff'}/>
      }
    </View>
  )
  const renderLeftActions = () => (
      <View style={style.SwipeLeftAction}>
      <MaterialCommunityIcons name="trash-can-outline" size={30} color={'#fff'}/>
    </View>
  )

  const handleDeleteHabit = async(id: string) => {
    try {
      await database.deleteDocument(DATABASE_ID, HABIT_COLLECTION_ID, id)
    } catch (error) {
      console.log(error)
    }
  }

  const handleCompleteHabit = async(id: string) => {
    const currentDate = new Date().toISOString();
    if(!user || completedHabits?.includes(id)) return;

    try {
      await database.createDocument(DATABASE_ID, COMPLETIONS_COLLECTION_ID, 
        ID.unique(),
        {
          habit_id: id,
          user_id: user?.$id,
          completed_at: currentDate,
        }
      )
      const habit = habits.find(h => h.$id === id);
      if(!habit) return;

       await database.updateDocument(DATABASE_ID, HABIT_COLLECTION_ID, id, 
        {streak_count: habit.streak_count + 1, last_completed: currentDate }
       )
    } catch (error) {
      console.log(error)
    }
  }

  const isHabitCompleted = (habitId: string) => completedHabits?.includes(habitId);
  
  return (
    <View style={style.container}>
      <View style={style.header}>
        <Text variant="headlineSmall" style={style.title}>Today's Habit</Text>
        <Button mode="text" icon={'logout'} onPress={signOut}>Logout</Button>
      </View>

    <ScrollView showsVerticalScrollIndicator={false}>
      {habits.length === 0 ? (
        <View style={style.emptyState}>
          <Text style={style.emptyStateText}>No Habits Yet, <Link style={{color: 'blue'}} href='/add-habit'>click here</Link> to Add you first Habit!</Text>
        </View>
      ) : (
        habits?.map((habit, key) => (
        <Swipeable ref={(ref) => {
          swipeableRef.current[habit.$id] = ref;
        }} 
        key={key} overshootLeft={false} overshootRight={false}
        renderRightActions={() =>renderRightActions(habit.$id)}
        renderLeftActions={renderLeftActions} 
        onSwipeableOpen={(direction) => {
          if(direction === 'left'){
            handleDeleteHabit(habit.$id)
          }else if (direction === 'right'){
            handleCompleteHabit(habit.$id);
          }

          swipeableRef.current[habit.$id]?.close();
        }}
        >
          <Surface style={[style.card, isHabitCompleted(habit.$id) && style.completedCard ]}>
          <View style={style.cardContext}>
            <Text style={style.cardTitle}>{habit.title}</Text>
            <Text style={style.cardDescription}>{habit.description}</Text>
            <View style={style.cardFooter}>
              <View style={style.streakBadge}>
                <MaterialCommunityIcons name="fire" size={20} color={'#ff9800'}/>
                <Text style={style.streakText}>{habit.streak_count} day streak</Text>
              </View>
              <View style={style.frequencyBadge}>
                <Text style={style.frequencyText}>{habit.frequency[0].toUpperCase() + habit.frequency.slice(1)}</Text>
              </View>
            </View>
          </View>
          </Surface>
      </Swipeable>
        ))
      )}
      </ScrollView>
    </View>
  );
}


const style = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5'
  },
  header: {
     flexDirection: 'row',
     justifyContent: 'space-between',
     alignItems: 'center',
     marginBottom: 24
  },
  title: {
    fontWeight: 'bold'
  },
  card: {
    marginBottom: 18,
    borderRadius: 18,
    backgroundColor: '#f7f2fa',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4
  },
  cardContext: {
    padding: 20
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#22223b'
  },
  cardDescription: {
    fontSize: 15,
    marginBottom: 15,
    color: '#6c6c80'
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3e0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4    
  },
  streakText: {
    marginLeft: 6, 
    color: '#ff9800',
    fontWeight: 'bold',
    fontSize: 14
  },
  frequencyBadge: {
    backgroundColor: '#ede7f6',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4    
  },
  frequencyText: {
    color: '#7c4dff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'

  },
  emptyStateText: {
    color: '#666666'
  },
  SwipeRightAction: {
    flex: 1,
    backgroundColor: '#4acf50',
    justifyContent: 'center',
    alignItems: 'flex-end',
    borderRadius: 18,
    marginBottom: 18,
    marginTop: 2,
    paddingRight: 16
  },
  SwipeLeftAction: {
    flex: 1,
    backgroundColor: '#e53935',
    justifyContent: 'center',
    alignItems: 'flex-start',
    borderRadius: 18,
    marginBottom: 18,
    marginTop: 2,
    paddingRight: 16
  },
  completedCard: {
    opacity: 0.6
  }

})