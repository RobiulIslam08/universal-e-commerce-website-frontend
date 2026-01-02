"use client";
import Loading from "@/components/common/Loading";
import { makeStore } from "@/redux/store";
import { useState } from "react"; // useRef বাদ দিয়ে useState নিন
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // useRef এর পরিবর্তে useState ব্যবহার করুন।
  // useState এর ভিতরে ফাংশন দিলে সেটি কম্পোনেন্ট মাউন্ট হওয়ার সময় মাত্র একবারই রান হয়।
  const [storeData] = useState(() => {
    const store = makeStore();
    const persistor = persistStore(store);
    return { store, persistor };
  });

  return (
    // এখন আর কোনো ref.current এরর আসবে না কারণ এটি এখন State
    <Provider store={storeData.store}>
      <PersistGate 
        loading=<Loading/>
        persistor={storeData.persistor}
      >
        {children}
      </PersistGate>
    </Provider>
  );
}