let Service, Characteristic;
let exec       = require('child_process').exec;

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
  this.set_timeout  = config['set_timeout'] || 10000;
  this.get_timeout  = config['get_timeout'] || 50000;
  this.onCommand    = 'gatttool -t random -b ' + this.BleMac + ' --char-write-req -a 0x0016 -n ' + this.onCmd;
  this.offCommand   = 'gatttool -t random -b ' + this.BleMac + ' --char-write-req -a 0x0016 -n ' + this.offCmd;
  this.stateCommand = 'gatttool -t random -b ' + this.BleMac + ' --char-read -a 0x0016';
  this.onValue      = 'Characteristicvalue/descriptor:' + this.onCmd;
  if (this.onCmd === this.offCmd) {
    this.type = 'button';
  }
  else {
    this.type = 'switch';
  }
  this.informationService = new Service.AccessoryInformation();
  this.switchService      = new Service.Switch(this.name);

  this.informationService
  .setCharacteristic(Characteristic.Manufacturer, 'script3 Manufacturer')
  .setCharacteristic(Characteristic.Model, 'script3 Model')
  .setCharacteristic(Characteristic.SerialNumber, 'script3 Serial Number');

  this.switchService
  .getCharacteristic(Characteristic.On)
  .on('set', this.setState.bind(this))

  this.switchService
  .getCharacteristic(Characteristic.On)
  .on('get', this.getState.bind(this));
}

//------------------------------------------------------------------------------
switchbotWHAccessory.prototype.getServices = function() {
  return [this.informationService, this.switchService];
}

//------------------------------------------------------------------------------
switchbotWHAccessory.prototype.setState = function(powerOn, callback) {
  if      (this.type == 'button') {
    this.log('SET1： ' + powerOn);
    exec(powerOn ? this.onCommand : this.offCommand, function (error, stdout, stderr) {
      if (stdout) {console.log(stdout); }
      callback(error, stdout, stderr)
    });
  }

//  else if (this.type == 'button' && !powerOn) {
//    setTimeout(function() {
//      this.switchService.setCharacteristic(Characteristic.On, false);
//    }.bind(this), 3000);
//    this.log('SET2： ' + powerOn);
//  }

  else if (this.type == 'switch') {
    this.log('SET1： ' + powerOn);
    exec(powerOn ? this.onCommand : this.offCommand, function (error, stdout, stderr) {
      if (stdout) {console.log(stdout); }
      callback(error, stdout, stderr)
    });
  }
}
//------------------------------------------------------------------------------
switchbotWHAccessory.prototype.getState = function(callback) {
  var it = this;
  exec(it.stateCommand, {timeout: this.get_timeout}, function (error, stdout, stderr) {
    if (stderr) { return; }
    var cleanOut=stdout.toLowerCase().replace(/\s+/g, "");
    console.log('State of ' + it.name + ' is: ' + stdout);
    callback(null, cleanOut == it.onValue);
  });
}
