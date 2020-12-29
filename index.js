let Service, Characteristic;
const execa      = require('execa');

module.exports = function(homebridge) {
  Service        = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory('homebridge-switchbot-wohand', 'switchbot-wohand', switchbotWHAccessory);
}

//------------------------------------------------------------------------------
function switchbotWHAccessory(log, config) {
  this.log          = log;
  this.name         = config['name'];
  this.BleMac       = config['BleMac'];
  this.onCmd        = config['on'];
  this.offCmd       = config['off'];
  this.button_off   = config['button_off'] || 8000;
  this.dummy_log    = config['dummy_log'] || false;
  this.retry        = config['retry'] || 5;
  this.onCommand    = 'gatttool -t random -b ' + this.BleMac + ' --char-write-req -a 0x0016 -n ' + this.onCmd;
  this.offCommand   = 'gatttool -t random -b ' + this.BleMac + ' --char-write-req -a 0x0016 -n ' + this.offCmd;
  this.stateCommand = 'gatttool -t random -b ' + this.BleMac + ' --char-read -a 0x0016';
  this.onValue      = 'Characteristic value/descriptor: ' + this.onCmd + ' ';
  this.onValue      = this.onValue.toLowerCase().replace(/\s+/g, "");
  if (this.onCmd === this.offCmd) {
    this.type = 'button';
  }
  else {
    this.type = 'switch';
  }
  this.informationService = new Service.AccessoryInformation();
  this.switchService      = new Service.Switch(this.name);

  this.informationService
  .setCharacteristic(Characteristic.Manufacturer, 'switchbot-wohand Manufacturer')
  .setCharacteristic(Characteristic.Model, 'switchbot-wohand Model')
  .setCharacteristic(Characteristic.SerialNumber, 'switchbot-wohand Serial Number');

  this.switchService
  .getCharacteristic(Characteristic.On)
  .on('set', this.setState.bind(this))

  this.switchService
  .getCharacteristic(Characteristic.On)
  .on('get', this.getState.bind(this));

  if (this.type == 'button') {
    this.switchService.setCharacteristic(Characteristic.On, false);
  }
}

//------------------------------------------------------------------------------
switchbotWHAccessory.prototype.getServices = function() {
  return [this.informationService, this.switchService];
}

//------------------------------------------------------------------------------
switchbotWHAccessory.prototype.setState = function(powerOn, callback) {
  if      (this.type == 'button' && powerOn) {
    for (let j=1; j<=this.retry; j++) {
      try {
        let SState = execa.commandSync(this.onCommand);
        this.log(' ＜＜＜ [SET Button： ' + powerOn + ' ]');
        callback(null);
        return;
      }
      catch {
        setTimeout(function(){}, 50000);
        this.log('SET Button Retry: ' + j);
        continue;
      }
    }
  }

  else if (this.type == 'button' && !powerOn) {
    setTimeout(function() {
      this.switchService.setCharacteristic(Characteristic.On, false);
    }.bind(this), this.button_off);
    if (this.dummy_log) {this.log('SET Button(Dummy)： ' + powerOn); }
    callback(null);
    return;
  }


  else if (this.type == 'switch') {
    for (let j=1; j<=this.retry; j++) {
      try {
        let SState = execa.commandSync(powerOn ? this.onCommand : this.offCommand);
        this.log(' ＜＜＜ [SET Switch： ' + powerOn + ' ]');
        callback(null);
        return;
      }
      catch {
        setTimeout(function(){}, 50000);
        this.log('SET Switch Retry: ' + j);
        continue;
      }
    }
  }
}
//------------------------------------------------------------------------------
switchbotWHAccessory.prototype.getState = function(callback) {
  for (let i=1; i<=this.retry; i++) {
    try {
      let GState = execa.commandSync(this.stateCommand);
      let cleanOut = GState.stdout.toLowerCase().replace(/\s+/g, "");
      this.log(' ＞＞＞ [Status GET]');
      callback(null, (this.type == 'button') ? false : cleanOut == this.onValue);
      return;
      }
    catch {
      setTimeout(function(){}, 100000);
      this.log('GET Retry: ' + i);
      continue;
    }
  }
}
