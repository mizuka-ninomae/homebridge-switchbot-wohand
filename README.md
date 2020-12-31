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

* `accessory` → 固定値（Fixed value）[必須項目（required field）]
* `name` → お好みに（To your liking）[必須項目（required field）]
* `BleMac` → 公式appのBLU MACの値を入力（Enter the BLU MAC value of the official app）[必須項目（required field）]
* `on`、`off` → `on`：570101／`off`：570102、もしくは`on`：570104（UP）／`off`：570103（DOWN）
または、`on`：570100／`off`：570100（button mode）のいづれかを入力。
onとoffが同じ値であるとbutton modeと判断されます。
button modeになるとswitchを定期的にoffにしようとする見えない力が働きます。
この３つの組み合わせ以外は何が起こるか分かりません。
（I don't know what will happen other than these three combinations.）
省略すると`on`：570101／`off`：570102になります。
（If omitted, it will be on: 570101 / off: 570102.）
* `dummy_log` → button modeの見えない力を可視化します。[Default: false]
* `button_off` → button modeの見えない力がswitchをoffにしようとする間隔。[Default: 8000ミリ秒]
* `retry` → GET／SETに失敗した時にリトライする回数。（The number of retries when GET / SET fails.）[Default: 5]
