import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useAppDispatch, useAppSelector } from "../hooks/useAppDispatch";
import { logout } from "../store/authSlice";
import { fetchBalance, fetchTransactions } from "../store/transactionSlice";

const DashboardScreen = ({ navigation }: any) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { balance, transactions, loading } = useAppSelector(
    (state) => state.transaction
  );
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await Promise.all([
      dispatch(fetchBalance()),
      dispatch(fetchTransactions({ page: 1, limit: 5 })),
    ]);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const getTransactionColor = (type: string) => {
    return type === "deposit" ? "#10B981" : "#EF4444";
  };

  const getTransactionSymbol = (type: string) => {
    return type === "deposit" ? "+" : "-";
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* User Info */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.name}>
            {user?.firstName} {user?.lastName}
          </Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Balance Card */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Current Balance</Text>
        <Text style={styles.balanceAmount}>${balance.toFixed(2)}</Text>
        <View style={styles.balanceActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.depositButton]}
            onPress={() => navigation.navigate("Deposit")}
          >
            <Text style={styles.actionButtonText}>+ Deposit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.withdrawButton]}
            onPress={() => navigation.navigate("Withdraw")}
          >
            <Text style={styles.actionButtonText}>- Withdraw</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Transactions */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Transactions")}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {transactions.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No transactions yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Start by making a deposit!
            </Text>
          </View>
        ) : (
          transactions.slice(0, 5).map((transaction: any) => (
            <View key={transaction.id} style={styles.transactionItem}>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionType}>
                  {transaction.type.charAt(0).toUpperCase() +
                    transaction.type.slice(1)}
                </Text>
                <Text style={styles.transactionDate}>
                  {new Date(transaction.createdAt).toLocaleDateString()}
                </Text>
              </View>
              <Text
                style={[
                  styles.transactionAmount,
                  { color: getTransactionColor(transaction.type) },
                ]}
              >
                {getTransactionSymbol(transaction.type)}$
                {parseFloat(transaction.amount).toFixed(2)}
              </Text>
            </View>
          ))
        )}
      </View>

      {/* Account Status */}
      <View style={styles.statusCard}>
        <Text style={styles.statusTitle}>Account Status</Text>
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Verification:</Text>
          <View
            style={[
              styles.statusBadge,
              user?.isVerified ? styles.verifiedBadge : styles.pendingBadge,
            ]}
          >
            <Text style={styles.statusBadgeText}>
              {user?.isVerified ? "Verified" : "Pending"}
            </Text>
          </View>
        </View>
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Email:</Text>
          <Text style={styles.statusValue}>{user?.email}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  greeting: {
    fontSize: 14,
    color: "#6B7280",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 4,
  },
  logoutButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: "#F3F4F6",
  },
  logoutText: {
    color: "#4F46E5",
    fontWeight: "600",
  },
  balanceCard: {
    margin: 20,
    padding: 24,
    backgroundColor: "#4F46E5",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  balanceLabel: {
    fontSize: 14,
    color: "#E0E7FF",
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  balanceActions: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  depositButton: {
    backgroundColor: "#10B981",
  },
  withdrawButton: {
    backgroundColor: "#f00",
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  seeAllText: {
    fontSize: 14,
    color: "#4F46E5",
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#9CA3AF",
  },
  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  transactionInfo: {
    flex: 1,
  },
  transactionType: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: "#6B7280",
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: "bold",
  },
  statusCard: {
    margin: 20,
    marginTop: 0,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 16,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  statusLabel: {
    fontSize: 14,
    color: "#6B7280",
  },
  statusValue: {
    fontSize: 14,
    color: "#111827",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verifiedBadge: {
    backgroundColor: "#D1FAE5",
  },
  pendingBadge: {
    backgroundColor: "#FEF3C7",
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
});

export default DashboardScreen;
