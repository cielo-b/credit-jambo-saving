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
import { withdraw, clearError, fetchBalance } from "../store/transactionSlice";

const WithdrawScreen = ({ navigation }: any) => {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const dispatch = useAppDispatch();
  const { loading, error, balance } = useAppSelector(
    (state) => state.transaction
  );

  useEffect(() => {
    dispatch(fetchBalance());
  }, []);

  useEffect(() => {
    if (error) {
      Toast.show({
        type: "error",
        text1: "Withdrawal Failed",
        text2: error,
        position: "top",
      });
      dispatch(clearError());
    }
  }, [error]);

  const quickAmounts = [10, 50, 100, Math.floor(balance / 2)].filter(
    (amt) => amt > 0
  );

  const handleWithdraw = async () => {
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

    if (amountValue > balance) {
      Toast.show({
        type: "error",
        text1: "Insufficient Balance",
        text2: `You cannot withdraw more than $${balance.toFixed(2)}`,
        position: "top",
      });
      return;
    }

    const result = await dispatch(
      withdraw({
        amount: amountValue,
        description: description || "Withdrawal",
      })
    );

    if (withdraw.fulfilled.match(result)) {
      Toast.show({
        type: "success",
        text1: "Withdrawal Successful",
        text2: `Successfully withdrew $${amountValue.toFixed(2)}`,
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
          <Text style={styles.icon}>💸</Text>
          <Text style={styles.title}>Withdraw Funds</Text>
          <Text style={styles.subtitle}>
            Withdraw from your savings account
          </Text>
        </View>

        {/* Available Balance */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceAmount}>${balance.toFixed(2)}</Text>
        </View>

        {/* Quick Amounts */}
        <View style={styles.quickAmounts}>
          <Text style={styles.label}>Quick Amount:</Text>
          <View style={styles.quickAmountsGrid}>
            {quickAmounts.map((quickAmount, index) => (
              <TouchableOpacity
                key={index}
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
            placeholder="e.g., Emergency expense"
            placeholderTextColor="#9CA3AF"
            value={description}
            onChangeText={setDescription}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleWithdraw}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Confirm Withdrawal</Text>
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
    marginBottom: 20,
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
  balanceCard: {
    backgroundColor: "#FEF3C7",
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    alignItems: "center",
  },
  balanceLabel: {
    fontSize: 14,
    color: "#92400E",
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#78350F",
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
    borderColor: "#EF4444",
    borderRadius: 8,
    alignItems: "center",
  },
  quickAmountText: {
    color: "#EF4444",
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
    borderColor: "#EF4444",
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
    backgroundColor: "#EF4444",
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

export default WithdrawScreen;
