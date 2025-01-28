"use client"
import { useEffect, useState } from "react";
import { RawGtv, DictPair } from "postchain-client";
import { useSessionContext } from "./components/ContextProvider";
export function useQuery<
  TReturn extends RawGtv,
  TArgs extends DictPair | undefined = DictPair
>(name: string, args?: TArgs) {
  const session = useSessionContext();
  const [serializedArgs, setSerializedArgs] = useState(JSON.stringify(args));
  const [data, setData] = useState<TReturn | undefined>();
  const sendQuery = async () => {
    if (!session || !args) return;
    const data = await session.query<TReturn>({ name: name, args: args });
    setSerializedArgs(JSON.stringify(args));
    setData(data!!);
  };

  useEffect(() => {
    sendQuery().catch(console.error);
  }, [session, name, serializedArgs]);

  return {
    result: data,
    reload: sendQuery,
  };
}
