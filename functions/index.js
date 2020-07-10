"use strict";

const functions = require("firebase-functions");
const express = require("express");
const line = require("@line/bot-sdk");
const line_key = functions.config().line;
const zoom_url = functions.config().url;
const app = express();

const config = {
  channelSecret: line_key.channel_secret, // LINE Developersでの準備②でメモったChannel Secret
  channelAccessToken: line_key.channel_access_token, // LINE Developersでの準備②でメモったアクセストークン
};
const client = new line.Client(config);

// WebHookのエンドポイント
app.post("/webhook", line.middleware(config), (req, res) => lineBot(req, res));

function lineBot(req, res) {
  res.status(200).end(); // すぐにLINE側にステータスコード200でレスポンス
  const promises = []; // すべてのイベント処理のpromiseを格納する配列
  const events = req.body.events; // イベントオブジェクト
  console.log(req.body.events[0].source);
  // Cf5e99d663ff3cb029ae950a869a06ef9;
  // イベントオブジェクトを処理
  events.forEach((event) => {
    // イベントタイプが"message"で、typeが"text"だった場合
    if (event.type === "message" && event.message.type == "text") {
      if (event.message.text === "月曜日") {
        promises.push(
          client.replyMessage(event.replyToken, {
            type: "template",
            altText: "月曜日の科目",
            template: {
              type: "buttons",
              text: `どの月曜日の科目`,
              actions: [
                {
                  type: "message",
                  label: "IW31",
                  text: `IW31のURLはこれかな\n${zoom_url.iw31}`,
                },
                {
                  type: "message",
                  label: "MD31",
                  text: `MD31のURLはこれ\n${zoom_url.md31}`,
                },
              ],
            },
          })
        );
      } else if (event.message.text === "火曜日") {
        promises.push(
          client.replyMessage(event.replyToken, {
            type: "template",
            altText: "火曜日の科目",
            template: {
              type: "buttons",
              text: `どの火曜日の科目`,
              actions: [
                {
                  type: "message",
                  label: "IW32",
                  text: `IW32のURLはこれ\n${zoom_url.iw32_t}`,
                },
                {
                  type: "message",
                  label: "BT31",
                  text: `BT31のURLはこれ\n${zoom_url.bt31}`,
                },
              ],
            },
          })
        );
      } else if (event.message.text === "水曜日") {
        promises.push(
          client.replyMessage(event.replyToken, {
            type: "template",
            altText: "水曜日の科目",
            template: {
              type: "buttons",
              text: `どの水曜日の科目`,
              actions: [
                {
                  type: "message",
                  label: "WB34",
                  text: `WB34のURLはこれ\n${zoom_url.wb34}`,
                },
                {
                  type: "postback",
                  label: "資格",
                  data: JSON.stringify({ action: "資格" }),
                },
              ],
            },
          })
        );
      } else if (event.message.text === "木曜日") {
        promises.push(
          client.replyMessage(event.replyToken, {
            type: "template",
            altText: "木曜日の科目",
            template: {
              type: "buttons",
              text: `どの木曜日の科目`,
              actions: [
                {
                  type: "message",
                  label: "2限WA32",
                  text: `2限WA32のURLはこれ\n${zoom_url.wa32_2}`,
                },
                {
                  type: "message",
                  label: "3限WA32",
                  text: `3限WA32のURLはこれ\n${zoom_url.wa32_3}`,
                },
                {
                  type: "message",
                  label: "PH34",
                  text: `PH34のURLはこれ\n${zoom_url.ph34}`,
                },
              ],
            },
          })
        );
      } else if (event.message.text === "金曜日") {
        promises.push(
          client.replyMessage(event.replyToken, {
            type: "template",
            altText: "金曜日の科目",
            template: {
              type: "buttons",
              text: `どの金曜日の科目`,
              actions: [
                {
                  type: "message",
                  label: "IW32",
                  text: `IW32のURLはこれ\n${zoom_url.iw32_f}`,
                },
                {
                  type: "message",
                  label: "FX31",
                  text: `FX31のURLはこれ\n${zoom_url.fx31}`,
                },
              ],
            },
          })
        );
      }
    } else if (event.type === "postback") {
      if (JSON.parse(event.postback.data).action === "資格") {
        promises.push(
          client.replyMessage(event.replyToken, {
            type: "template",
            altText: "資格",
            template: {
              type: "buttons",
              text: `どの資格`,
              actions: [
                {
                  type: "message",
                  label: "FE3S",
                  text: `FE3SのURLはこれ\n${zoom_url.fe3s}`,
                },
                {
                  type: "message",
                  label: "AP3S",
                  text: `AP3SのURLはこれ\n${zoom_url.ap3s}`,
                },
                {
                  type: "message",
                  label: "ND3S",
                  text: `ND3SのURLはこれ\n${zoom_url.nd3s}`,
                },
              ],
            },
          })
        );
      }
    }
  });

  Promise.all(promises).then(console.log(`promise completed\n`));
}

exports.app = functions.https.onRequest(app);
// https://script.google.com/macros/s/AKfycbwtG27KUTQWY-Q6nsr0PGA1ySx7MhKG-LDsvsmnq1R622RS1ftQ/exec
