import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useAppSelector } from "../hooks/useAppDispatch";

// Screens
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import DashboardScreen from "../screens/DashboardScreen";
import DepositScreen from "../screens/DepositScreen";
import WithdrawScreen from "../screens/WithdrawScreen";
import TransactionsScreen from "../screens/TransactionsScreen";

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: "#4F46E5",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        {!isAuthenticated ? (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ title: "Create Account" }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Dashboard"
              component={DashboardScreen}
              options={{ title: "💰 Savings Account" }}
            />
            <Stack.Screen
              name="Deposit"
              component={DepositScreen}
              options={{ title: "Make Deposit" }}
            />
            <Stack.Screen
              name="Withdraw"
              component={WithdrawScreen}
              options={{ title: "Withdraw Funds" }}
            />
            <Stack.Screen
              name="Transactions"
              component={TransactionsScreen}
              options={{ title: "Transaction History" }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
