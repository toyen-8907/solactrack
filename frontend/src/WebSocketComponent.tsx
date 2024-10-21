import React, { useEffect, useState } from 'react';

// 定義接收到的消息類型
interface AccountNotification {
  context: { slot: number };
  value: {
    parsed: { info: { authority: string } };
    lamports: number;
    data: { program: string };
  };
}

interface WebSocketComponentProps {
  onConnectionStatus: (status: string) => void; // 接受狀態更新的回調函數
  account: string; // 需要訂閱的帳戶
  onMessageReceived: (message: string) => void; // 新增的回調，用於傳遞消息
}

const WebSocketComponent: React.FC<WebSocketComponentProps> = React.memo(({ onConnectionStatus, account, onMessageReceived }) => {
  const [messages, setMessages] = useState<string[]>([]); // 存儲接收到的消息

  useEffect(() => {
    const ws = new WebSocket("wss://api.devnet.solana.com/");

    const handleOpen = () => {
      console.log("WebSocket connection opened.");
      onConnectionStatus("Connected"); // 通知父組件連接成功
      subscribeToAccount(ws, account); // 訂閱帳戶
    };

    const handleMessage = (ev: MessageEvent<any>) => {
        const parsedData = JSON.parse(ev.data); // 解析接收到的消息
        console.log("Received raw data:", parsedData); // 打印原始數據
        // 這裡檢查所有可能的返回值
        if (parsedData.method) {
          console.log(`Received method: ${parsedData.method}`);
        }
        if (parsedData.result) {
          console.log("Result: ", parsedData.result);
        }
        if (parsedData.error) {
          console.error("Error: ", parsedData.error);
        }
      };
      
      

    const handleClose = (event: CloseEvent) => {
      console.log("WebSocket connection closed: ", event);
      onConnectionStatus("Disconnected"); // 更新狀態為已斷開
    };

    const handleError = (error: Event) => {
      console.error("WebSocket error: ", error);
      onConnectionStatus("Error"); // 更新狀態為錯誤
    };

    // 添加事件監聽器
    ws.addEventListener("open", handleOpen);
    ws.addEventListener("message", handleMessage);
    ws.addEventListener("close", handleClose);
    ws.addEventListener("error", handleError);

    return () => {
      ws.close(); // 清理 WebSocket 連接
    };
  }, [onConnectionStatus, account, onMessageReceived]); // 添加 onMessageReceived 作為依賴

  // 訂閱帳戶的函式
  const subscribeToAccount = (ws: WebSocket, account: string) => {
    const requestData = {
      jsonrpc: "2.0",
      id: 1717,
      method: "accountSubscribe",
      params: [
        account, // 使用傳入的帳戶
        {
          encoding: "jsonParsed",
          commitment: "finalized", // 修正錯字 'comfirmed' 為 'finalized'
        }, 
      ],
    };
    ws.send(JSON.stringify(requestData)); // 發送請求到 WebSocket
  };

  // 格式化消息的函式
  const formatMessage = (notification: AccountNotification) => {
    const { slot } = notification.context; // 獲取槽號
    const authority = notification.value.parsed.info.authority; // 獲取權限者地址
    const lamports = notification.value.lamports; // 獲取 lamports 數量
    const program = notification.value.data.program; // 獲取程序名稱
    return `Slot: ${slot}, Authority: ${authority}, Lamports: ${lamports}, Program: ${program}`; // 格式化為字符串
  };

  return null; // 不渲染任何 UI
});

export default WebSocketComponent;
