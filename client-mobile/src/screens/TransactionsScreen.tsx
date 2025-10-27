import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { useAppDispatch, useAppSelector } from "../hooks/useAppDispatch";
import { fetchTransactions } from "../store/transactionSlice";

const TransactionsScreen = () => {
  const dispatch = useAppDispatch();
  const { transactions, loading } = useAppSelector(
    (state) => state.transaction
  );
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<"all" | "deposit" | "withdrawal">("all");

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    await dispatch(fetchTransactions({ page: 1, limit: 50 }));
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTransactions();
    setRefreshing(false);
  };

  const getTransactionColor = (type: string) => {
    return type === "deposit" ? "#10B981" : "#EF4444";
  };

  const getTransactionSymbol = (type: string) => {
    return type === "deposit" ? "+" : "-";
  };

  const getTransactionIcon = (type: string) => {
    return type === "deposit" ? "📥" : "📤";
  };

  const filteredTransactions = transactions.filter((t: any) =>
    filter === "all" ? true : t.type === filter
  );

  const renderTransaction = ({ item }: any) => (
    <View style={styles.transactionCard}>
      <View style={styles.transactionIcon}>
        <Text style={styles.icon}>{getTransactionIcon(item.type)}</Text>
      </View>
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionType}>
          {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
        </Text>
        <Text style={styles.transactionDescription}>
          {item.description || "No description"}
        </Text>
        <Text style={styles.transactionDate}>
          {new Date(item.createdAt).toLocaleString()}
        </Text>
      </View>
      <View style={styles.transactionRight}>
        <Text
          style={[
            styles.transactionAmount,
            { color: getTransactionColor(item.type) },
          ]}
        >
          {getTransactionSymbol(item.type)}${parseFloat(item.amount).toFixed(2)}
        </Text>
        <Text style={styles.balanceAfter}>
          Balance: ${parseFloat(item.balanceAfter).toFixed(2)}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Filter Tabs */}
      <View style={styles.filterTabs}>
        <TouchableOpacity
          style={[styles.tab, filter === "all" && styles.activeTab]}
          onPress={() => setFilter("all")}
        >
          <Text
            style={[styles.tabText, filter === "all" && styles.activeTabText]}
          >
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, filter === "deposit" && styles.activeTab]}
          onPress={() => setFilter("deposit")}
        >
          <Text
            style={[
              styles.tabText,
              filter === "deposit" && styles.activeTabText,
            ]}
          >
            Deposits
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, filter === "withdrawal" && styles.activeTab]}
          onPress={() => setFilter("withdrawal")}
        >
          <Text
            style={[
              styles.tabText,
              filter === "withdrawal" && styles.activeTabText,
            ]}
          >
            Withdrawals
          </Text>
        </TouchableOpacity>
      </View>

      {/* Transactions List */}
      <FlatList
        data={filteredTransactions}
        renderItem={renderTransaction}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No transactions found</Text>
            <Text style={styles.emptyStateSubtext}>
              {filter !== "all"
                ? `No ${filter}s yet`
                : "Start by making a deposit!"}
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  filterTabs: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#4F46E5",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  activeTabText: {
    color: "#4F46E5",
  },
  listContent: {
    padding: 16,
  },
  transactionCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  transactionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  icon: {
    fontSize: 24,
  },
  transactionInfo: {
    flex: 1,
    justifyContent: "center",
  },
  transactionType: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  transactionDescription: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  transactionRight: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  balanceAfter: {
    fontSize: 12,
    color: "#6B7280",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#9CA3AF",
  },
});

export default TransactionsScreen;
