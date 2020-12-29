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
または、on:570100／off:570100（button mode）
onとoffが同じ値であるとbutton modeと判断されます。
button modeになるとswitchを定期的にoffにしようとする見えない力が働きます。
この３つの組み合わせ以外は何が起こるか分かりません。
（I don't know what will happen other than these three combinations.）
* `button_off` button modeの見えない力がswitchをoffにしようとする間隔、デフォルトは8000ミリ秒。
* `dummy_log` button modeの見えない力を可視化します、デフォルトは見えない（false）。
* `retry` GET／SETに失敗した時にリトライする回数、デフォルトは５回。（The number of retries when GET / SET fails, the default is 5 times.）
