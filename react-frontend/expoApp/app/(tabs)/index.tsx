import { Platform, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

export default function HomeScreen() {
  if (Platform.OS === "web") {
    return (
      <iframe
        src="http://192.168.2.50:3000"
        style={{ width: "100%", height: "100%", border: "none" }}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom", "left", "right"]}>
      <WebView
        source={{ uri: "http://192.168.2.50:3000" }}
        style={{ flex: 1 }}
        startInLoadingState={true}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn("WebView error: ", nativeEvent);
        }}
        onHttpError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn(
            "WebView HTTP error: ",
            nativeEvent.statusCode,
            nativeEvent.description
          );
        }}
        originWhitelist={["*"]}
        mixedContentMode="always"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
