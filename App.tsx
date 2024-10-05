import * as React from "react";
import 'react-native-gesture-handler';
import { Provider } from "react-redux";
import store from "./src/store";
import { QueryClient, QueryClientProvider } from "react-query";
import AppNavigator from "./src/navigator/appNavigator";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: 1,
      staleTime: 5 * 1000,
    }
  }
})

const App = () => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AppNavigator />
      </QueryClientProvider>
    </Provider>
  )
};

export default App;
