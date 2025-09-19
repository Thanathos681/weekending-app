// app/screens/Auth.tsx
import React, { useState, useEffect, useContext } from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../providers/AuthProvider";

type AuthView = "login" | "register" | "forgot-password" | "registration-success";

export default function Auth() {
  const [currentView, setCurrentView] = useState<AuthView>("login");
  const [registeredEmail, setRegisteredEmail] = useState("");
  const { user, isLoading } = useContext(AuthContext);
  const navigation = useNavigation();

  // Redirect if already authenticated
  useEffect(() => {
    if (user && !isLoading) {
      const hasCompletedOnboarding = user.user_metadata?.onboarding_completed;
      if (hasCompletedOnboarding) {
        navigation.navigate("Dashboard" as never);
      } else {
        navigation.navigate("Onboarding" as never);
      }
    }
  }, [user, isLoading]);

  // Placeholder views (replace with LoginForm, RegisterForm, etc.)
  if (currentView === "registration-success") {
    return (
      <View style={styles.container}>
        <Text>Registration Success!</Text>
        <Text>{registeredEmail}</Text>
        <Button title="Back to Login" onPress={() => setCurrentView("login")} />
      </View>
    );
  }

  if (currentView === "forgot-password") {
    return (
      <View style={styles.container}>
        <Text>Forgot Password</Text>
        <Button title="Back to Login" onPress={() => setCurrentView("login")} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {currentView === "login" ? "Welcome Back" : "Join The Weekending"}
      </Text>
      <Text style={styles.subtitle}>
        {currentView === "login"
          ? "Sign in to continue your fitness journey"
          : "Create your account to start tracking your workouts"}
      </Text>

      {currentView === "login" ? (
        <>
          <Button title="Login Form" onPress={() => Alert.alert("TODO: LoginForm")} />
          <Button title="Go to Register" onPress={() => setCurrentView("register")} />
          <Button title="Forgot Password" onPress={() => setCurrentView("forgot-password")} />
        </>
      ) : (
        <>
          <Button title="Register Form" onPress={() => Alert.alert("TODO: RegisterForm")} />
          <Button title="Go to Login" onPress={() => setCurrentView("login")} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: "center",
  },
});
