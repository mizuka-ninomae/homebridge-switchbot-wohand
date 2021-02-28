let Service, Characteristic;
const execa         = require ('execa');
const cron          = require ('node-cron');

module.exports = function (homebridge) {
  Service           = homebridge.hap.Service;
  Characteristic    = homebridge.hap.Characteristic;
  homebridge.registerAccessory ('homebridge-switchbot-wohand', 'switchbot-wohand', switchbotWHAccessory);
}

function switchbotWHAccessory (log, config) {
  this.log          = log;
  this.name         = config ['name'];
  this.BleMac       = config ['BleMac'];
  this.onCmd        = config ['on'] || 570101;
  this.offCmd       = config ['off'] || 570102;
  if ((this.onCmd  == 570101 && this.offCmd == 570102) ||
      (this.onCmd  == 570104 && this.offCmd == 570103) ||
      (this.onCmd  == 570100 && this.offCmd == 570100)) {
  }
  else {
    this.onCmd      = 570101;
    this.offCmd     = 570102;
  }
  this.schedule     = config ["schedule"] || '*/10 * * * * *';
  this.dummy_log    = config ['dummy_log'] || false;
  this.retry        = (this.retry < 1) ? 1 : config ['retry'] || 5;
  this.onCommand    = `gatttool -t random -b ${this.BleMac} --char-write-req -a 0x0016 -n ${this.onCmd}`;
  this.offCommand   = `gatttool -t random -b ${this.BleMac} --char-write-req -a 0x0016 -n ${this.offCmd}`;
  this.stateCommand = `gatttool -t random -b ${this.BleMac} --char-read -a 0x0016`
  this.onValue      = `Characteristic value/descriptor: ${this.onCmd} `;
  this.onValue      = this.onValue.toLowerCase ().replace (/\s+/g, "");
  this.type         = (this.onCmd === this.offCmd) ? "button" : "switch" ;

  this.informationService = new Service.AccessoryInformation ();
  this.switchService      = new Service.Switch (this.name);

  if (this.type == 'button') {
    let job = cron.schedule(this.schedule, () => {
      this.switchService.updateCharacteristic (Characteristic.On, false);
      if (this.dummy_log) {this.log (` <<<< [SET Button(Dummy)：OFF]`); }
    })
  }
}

switchbotWHAccessory.prototype.getServices = function () {
  this.informationService
    .setCharacteristic (Characteristic.Manufacturer, 'switchbot-wohand Manufacturer')
    .setCharacteristic (Characteristic.Model, 'switchbot-wohand Model')
    .setCharacteristic (Characteristic.SerialNumber, 'switchbot-wohand Serial Number');

  this.switchService
    .getCharacteristic (Characteristic.On)
    .on ('set', this.setState.bind (this))
    .on ('get', this.getState.bind (this));

  return [this.informationService, this.switchService];
}

switchbotWHAccessory.prototype.setState = function (powerOn, callback) {
  if      (this.type == "button" && powerOn) {
    for (let j=1; j<=this.retry; j++) {
      try {
        execa.commandSync (this.onCommand);
        this.log (` <<<< [SET Button： ${powerOn ? "ON" : "OFF"}]`);
        callback (null);
        return;
      }
      catch {
        this.log (`SET Button Retry: ${j}`);
        setTimeout (function () {}, 50000);
      }
    }
    this.switchService
      .updateCharacteristic (Characteristic.On, new Error(`Error: ${this.name}`));
  }

  else if (this.type == "switch") {
    for (let j=1; j<=this.retry; j++) {
      try {
        execa.commandSync ((powerOn ? this.onCommand : this.offCommand));
        this.log (` <<<< [SET Switch： ${powerOn ? "ON" : "OFF"}]`);
        callback (null);
        return;
      }
      catch {
        this.log (`SET Switch Retry: ${j}`);
        setTimeout (function () {}, 50000);
      }
    }
    this.switchService
      .updateCharacteristic (Characteristic.On, new Error(`Error: ${this.name}`));
  }
}

switchbotWHAccessory.prototype.getState = function (callback) {
  for (let i=1; i<=this.retry; i++) {
    try {
      let gState = execa.commandSync (this.stateCommand);
        let cleanOut = gState.stdout.toLowerCase ().replace (/\s+/g, "");
        this.log (` >>>> [Status GET]`);
        callback (null, (this.type == 'button') ? false : cleanOut == this.onValue);
        return;
      }
    catch {
      this.log (`GET Retry: ${i}`);
      setTimeout (function () {}, 100000);

    }
  }
  this.switchService
    .updateCharacteristic (Characteristic.On, new Error(`Error: ${this.name}`));
}
