import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { RootStackParams } from "./rootStackParams";
import HomeScreen from "../screens/home";
import LoginScreen from "../screens/login";
import PrivateMessages from "../screens/privateMessages";
import { colors } from "../utils/variables";
import ContactsScreen from "../screens/contacts";
import UpdateProfileScreen from "../screens/updateProfile";
import { createDrawerNavigator } from "@react-navigation/drawer";
import CustomDrawerContent from "../components/home/drawer";
import SplashScreen from "../screens/splash";


const Stack = createStackNavigator<RootStackParams>();
const Drawer = createDrawerNavigator();

export const HomeDr = () => {
    return (
        <Drawer.Navigator initialRouteName="homenested"
            screenOptions={{
                drawerStyle: { width: "85%" },
            }}
            drawerContent={({ navigation }) => <CustomDrawerContent navigation={navigation} />}
        >
            <Drawer.Screen name="homenested" component={HomeScreen} options={{
                headerTitle: "Yozishmalar",
                headerTitleStyle: { color: "white" },
                headerStyle: {
                    backgroundColor: colors.blue
                },
                headerTintColor: "white",
            }} />
        </Drawer.Navigator >
    )
}

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="splash">
                <Stack.Screen name="splash" component={SplashScreen} options={{ headerShown: false }} />
                <Stack.Screen name="home" component={HomeDr} options={{ headerShown: false }} />
                <Stack.Screen name="login" component={LoginScreen} options={{ headerShown: false }} />
                <Stack.Screen name="privateMessages" component={PrivateMessages} options={({ route }) => ({
                    headerTitle: route.params?.user?.name,
                    headerTitleStyle: { color: "white" },
                    headerStyle: {
                        backgroundColor: colors.blue
                    },
                    headerTintColor: "white",
                })} />
                <Stack.Screen name="contact" component={ContactsScreen} options={{
                    headerTitle: "Kontaktlar",
                    headerTitleStyle: { color: "white" },
                    headerStyle: {
                        backgroundColor: colors.blue
                    },
                    headerTintColor: "white",
                }} />
                <Stack.Screen name="updateProfile" component={UpdateProfileScreen} options={{
                    headerTitle: "Ma'lumotlarni yangilash",
                    headerTitleStyle: { color: "white" },
                    headerStyle: {
                        backgroundColor: colors.blue
                    },
                    headerTintColor: "white",
                }} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}