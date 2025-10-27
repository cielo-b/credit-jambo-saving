import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Toast from "react-native-toast-message";
import { useAppDispatch, useAppSelector } from "../hooks/useAppDispatch";
import { deposit, clearError } from "../store/transactionSlice";

const DepositScreen = ({ navigation }: any) => {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.transaction);

  useEffect(() => {
    if (error) {
      Toast.show({
        type: "error",
        text1: "Deposit Failed",
        text2: error,
        position: "top",
      });
      dispatch(clearError());
    }
  }, [error]);

  const quickAmounts = [10, 50, 100, 500];

  const handleDeposit = async () => {
    const amountValue = parseFloat(amount);

    if (!amount || isNaN(amountValue) || amountValue <= 0) {
      Toast.show({
        type: "error",
        text1: "Invalid Amount",
        text2: "Please enter a valid amount",
        position: "top",
      });
      return;
    }

    const result = await dispatch(
      deposit({
        amount: amountValue,
        description: description || "Deposit",
      })
    );

    if (deposit.fulfilled.match(result)) {
      Toast.show({
        type: "success",
        text1: "Deposit Successful",
        text2: `Successfully deposited $${amountValue.toFixed(2)}`,
        position: "top",
      });
      setTimeout(() => navigation.goBack(), 1500);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.icon}>💵</Text>
          <Text style={styles.title}>Make a Deposit</Text>
          <Text style={styles.subtitle}>Add funds to your savings account</Text>
        </View>

        {/* Quick Amounts */}
        <View style={styles.quickAmounts}>
          <Text style={styles.label}>Quick Amount:</Text>
          <View style={styles.quickAmountsGrid}>
            {quickAmounts.map((quickAmount) => (
              <TouchableOpacity
                key={quickAmount}
                style={styles.quickAmountButton}
                onPress={() => setAmount(quickAmount.toString())}
              >
                <Text style={styles.quickAmountText}>${quickAmount}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Amount Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Amount</Text>
          <View style={styles.amountInputContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="0.00"
              placeholderTextColor="#9CA3AF"
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        {/* Description */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Monthly savings"
            placeholderTextColor="#9CA3AF"
            value={description}
            onChangeText={setDescription}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleDeposit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Confirm Deposit</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  icon: {
    fontSize: 64,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
  quickAmounts: {
    marginBottom: 24,
  },
  quickAmountsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  quickAmountButton: {
    flex: 1,
    minWidth: "22%",
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#4F46E5",
    borderRadius: 8,
    alignItems: "center",
  },
  quickAmountText: {
    color: "#4F46E5",
    fontWeight: "600",
    fontSize: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  amountInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#4F46E5",
    borderRadius: 8,
    paddingHorizontal: 15,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 32,
    fontWeight: "bold",
    color: "#111827",
    paddingVertical: 15,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    color: "#111827",
  },
  button: {
    backgroundColor: "#10B981",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default DepositScreen;
