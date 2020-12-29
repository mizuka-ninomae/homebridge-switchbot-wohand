これ何？（What is this?）

homebridge用、SwitchBot bot(wohand)Plugin。
SwitchBotの為のプラグインは他にも沢山あるけれど、自分好みのものが見つからなかったので作ってみました。

gatttoolが必要です。（gatttool required）

config.json 記入例
```js

"accessories": [
    {
        "accessory": "switchbot-wohand",
        "name": "Wall Switch",
        "BleMac": "XX:XX:XX:XX:XX:XX",
        "on": "570101",
        "off": "570102"
    },
  {
  ～
  }]
```

Note:
* `accessory` 固定値（Fixed value）
* `name` お好みに（To your liking）
* `BleMac` 公式appのBLU MACの値を入力（Enter the BLU MAC value of the official app）
* `on`、`off` on:570101／off:570102、もしくはon:570104(UP)／off:570103(DOWN)
