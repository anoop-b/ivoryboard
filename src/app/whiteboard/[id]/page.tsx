"use client";

import {
  getSceneVersion,
  MainMenu,
  restoreElements,
  useHandleLibrary,
} from "@excalidraw/excalidraw";
import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import {
  AppState,
  BinaryFileData,
  BinaryFiles,
  ExcalidrawAPIRefValue,
  ExcalidrawImperativeAPI,
  ExcalidrawProps,
  LibraryItems,
  LibraryItemsSource,
} from "@excalidraw/excalidraw/types/types";
import {
  connect,
  consumerOpts,
  JSONCodec,
  KV,
  NatsConnection,
  ObjectStore,
  StorageType,
  StringCodec,
} from "nats.ws";
import {
  ForwardRefExoticComponent,
  MemoExoticComponent,
  RefAttributes,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";

const jc = JSONCodec<readonly ExcalidrawElement[]>();
const fc = JSONCodec<BinaryFileData>();

const sc = StringCodec();

export default function WhiteboardPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [nats, setNats] = useState<NatsConnection>();
  const [os, setOs] = useState<ObjectStore>();
  const [KV, setKv] = useState<KV>();
  const [cache, setCache] = useState<string[]>([]);
  const [Excalidraw, setExcalidraw] = useState<MemoExoticComponent<
    ForwardRefExoticComponent<
      ExcalidrawProps & RefAttributes<ExcalidrawAPIRefValue>
    >
  > | null>(null);
  const [excalidrawAPI, setExcalidrawAPI] =
    useState<ExcalidrawImperativeAPI | null>(null);

  useEffect(() => {
    import("@excalidraw/excalidraw").then((comp) =>
      setExcalidraw(comp?.Excalidraw),
    );

    (async () => {
      const nc = await connect({
        servers: ["wss://demo.nats.io:8443"],
        reconnectTimeWait: 1000,
        timeout: 80000,
      });
      setNats(nc);
      const js = nc.jetstream();
      const os = await js.views.os("WHITEBOARD", { storage: StorageType.File });
      setOs(os);
      const KeyValue = await js.views.kv("WHITEBOARD", {
        history: 5,
        timeout: 50000,
      });
      setKv(KeyValue);
      await KeyValue!.put(params.id, sc.encode("START"));
      console.log("connected to NATS");
    })();
    return () => {
      nats?.drain();
      console.log("closed NATS connection");
    };
  }, []);

  const onChange = async (
    elements: readonly ExcalidrawElement[],
    appState: AppState,
    files: BinaryFiles,
  ) => {
    if (elements.length !== 0) {
      elements.forEach(async (ele) => {
        if (ele.type === "image" && ele.status === "pending") {
          if (files !== undefined) {
            for (const [key, value] of Object.entries(files)) {
              if (!cache.includes(key)) {
                await KV!.create(value.id, fc.encode(value));
                setCache([...cache, value.id]);
              }
            }
          }
        }
      });
      nats?.publish("whiteboard.nats." + params.id, jc.encode(elements));
    }
  };

  useHandleLibrary({ excalidrawAPI });

  const updateScene = async () => {
    const opts = consumerOpts();
    opts.orderedConsumer();
    opts.deliverLastPerSubject();
    const sub = await nats
      ?.jetstream()
      .subscribe("whiteboard.nats." + params.id, opts);

    for await (const m of sub!) {
      const remoteData = jc.decode(m.data);
      const elements = excalidrawAPI?.getSceneElements();

      if (getSceneVersion(remoteData) > getSceneVersion(elements!)) {
        const sceneData = {
          elements: restoreElements(remoteData, null),
        };
        excalidrawAPI?.updateScene(sceneData);

        remoteData.forEach(async (ele) => {
          if (ele.type === "image") {
            if (!cache.includes(ele.fileId!)) {
              const kvImage = await KV?.get(ele.fileId!);
              if (kvImage != null) {
                setCache([...cache, kvImage.key]);
                excalidrawAPI?.addFiles([fc.decode(kvImage.value!)]);
              }
            }
          }
        });
      }
    }
  };

  const endSession = async () => {
    await KV?.put(params.id, sc.encode("TERMINATED"));

    excalidrawAPI?.setToast({
      message: "Session closed by the Host",
      duration: Infinity,
    });
    await nats!.drain();

    router.push("/end");
  };

  return (
    <div className="container mx-auto p-4">
      <nav>
        <div>
          <h1 className="text-5xl font-bold underline">IvoryBoard</h1>
          <div className="flex flex-row justify-end">
            <div className="p-2">
              <button
                className="mx-auto bg-gray-200 shadow-2xl text-zinc-500 font-bold py-2 px-4 rounded"
                onClick={() => updateScene()}
              >
                Sync
              </button>
            </div>
            <div className="p-2">
              <button
                className="mx-auto bg-gray-200 shadow-2xl text-zinc-500 font-bold py-2 px-4 rounded"
                onClick={() => endSession()}
              >
                End Session
              </button>
            </div>
          </div>
        </div>
      </nav>
      <div className="w-full md:pr-4">
        {nats ? (
          <h1 className="font-mono">Connected to : {nats?.getServer()} 🟢</h1>
        ) : (
          <h1 className="font-mono">Connecting to NATS...</h1>
        )}

        <div>
          <h1 className="font-mono">Your Room ID is: {params.id}</h1>
          <h1 className="font-mono">Your IP is {nats?.info?.client_ip}</h1>
        </div>
      </div>

      <div className="w-full md:px-4">
        <div className="p-4 m-4 mx-auto ">
          <div
            style={{ height: "800px" }}
            className="rounded-xl border shadow-2xl p-4"
          >
            {Excalidraw && (
              <Excalidraw
                zenModeEnabled={false}
                isCollaborating={true}
                gridModeEnabled={false}
                onChange={onChange}
                ref={(api: ExcalidrawImperativeAPI) => setExcalidrawAPI(api)}
                name={params.id}
              >
                <MainMenu>
                  <MainMenu.DefaultItems.SaveAsImage />
                  <MainMenu.DefaultItems.ClearCanvas />
                </MainMenu>
              </Excalidraw>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
