import { Stack } from "expo-router";

const RootLayout = ( ) => {
  return (
  <Stack>
     <Stack.Screen 
      name="index" 
      options={{
        headerShown: false,
        headerTitle: "Back"
     }} />

     <Stack.Screen
      name="about"
      options={{
        headerTitle: 'About',
        headerStyle: {
          backgroundColor: "green"
        },
        headerTintColor: "white",
      }}
       />

      <Stack.Screen
        name="help"
        options={{
          headerTitle: 'Help',
          headerStyle: {
            backgroundColor: "green"
          },
          headerTintColor: "white",
        }}/>

      <Stack.Screen
        name="categories"
        options={{
          headerShown: false
        }}/>
  </Stack>
    )
}

export default RootLayout