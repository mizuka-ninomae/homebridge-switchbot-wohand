#### これ何？（What is this?）

homebridge用、SwitchBot bot(wohand)Plugin。
SwitchBotの為のプラグインは他にも沢山あるけれど、自分好みのものが見つからなかったので作ってみました。

### 特徴・要件

* `gatttool` が必要です。（`gatttool` required）
* Bluetoothで直接botにコマンドを送受信する為、SwitchBot hub、SwitchBot hub mini等を必要としません。（Since commands are sent and received directly to the bot via Bluetooth, SwitchBot hub, SwitchBot hub mini, etc. are not required.）
* UP position / DOWN position等、通常の動作では停止しない位置でhandを停止させる事が可能です。（It is possible to stop the hand at a position that does not stop under normal operation, such as the UP position / DOWN position.）

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
    ・・・・
  }]
```

* `accessory` [必須項目（required）]： "switchbot-wohand" 固定（Fixed value）
* `name` [必須項目（required）]： お好みに（To your liking）
* `BleMac` [必須項目（required）]： 公式appのBLU MACの値を入力（Enter the BLU MAC value of the official app）
* `on`、`off` [オプション（optional）]： `on`：570101／`off`：570102、もしくは`on`：570104（UP）／`off`：570103（DOWN）
または、`on`：570100／`off`：570100（button mode）のいづれかを入力。
onとoffが同じ値であるとbutton modeと判断されます。
button modeになるとswitchを定期的にoffにしようとする見えない力が働きます。
この３つの組み合わせ以外は何が起こるか分かりません。
（I don't know what will happen other than these three combinations.）[Default ⇒ on：570101 / off：570102]
* `dummy_log` [オプション（optional）]： button modeの見えない力を可視化します。[Default ⇒ false]
* `schedule` [オプション（optional）]： button modeの見えない力がswitchをoffにしようとする間隔。[Default ⇒ */10 * * * * *(Every 10 seconds)]
* `retry` [オプション（optional）]： GET／SETに失敗した時にリトライする回数。（The number of retries when GET / SET fails.）[Default ⇒ 5]
