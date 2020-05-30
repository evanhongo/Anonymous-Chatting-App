const _ = require('lodash');

//y= Array.from({length:3}, (value, index) =>false);
const y = _.range(0, 30).map((value, indexY) => (
    _.range(0, 30).map((value, indexX) => (
        {
            id: indexX + 30 * indexY,
            x: indexX,
            y: indexY,
        }
    ))
));


const service = {
  statusUpdates: {},
  sendUpdate: function(status) {
    console.log(`Status sent ${status}`);
    const id = Math.floor(Math.random()*1000000);
    service.statusUpdates[id] = status;
    return id;
  },
  destroyUpdate: function(id) {
    console.log(`Status removed ${id}`);
    delete service.statusUpdates[id];
  }
};

/*class SendStatusCmd {     
  private postId: number ;
  public service: any;
  public status: string;

  constructor(service: any, status: string) {
    this.service = service;
    this.status = status;
  }

  execute() {
    this.postId = this.service.sendUpdate(this.status); 
  }

  undo() {
    if(this.postId) {
      this.service.destroyUpdate(this.postId);
      this.postId = null;
    }
  }
}

class Invoker {
  public history: SendStatusCmd[];

  constructor() {
    this.history = [];
  }

  execute(cmd: SendStatusCmd) {
    this.history.push(cmd);
    cmd.execute();
    console.log('Command executed');
  }

  delay(cmd: SendStatusCmd, delay: number) {
    const self = this;
    setTimeout(() => {
      self.execute(cmd);
    }, delay)
  }

  undo() {
    const cmd = this.history.pop();
    cmd.undo();
    console.log('Command undone');
  }

}


const cmd = new SendStatusCmd(service, 'hello');
const invoker = new Invoker();
invoker.execute(cmd);
invoker.undo();*/

let task1 = new Promise((resolve, reject) => {
    resolve('task1 completed');
});

let task2 = new Promise((resolve, reject) => {
  setTimeout(function(){
    resolve('task2 completed');
  }, 1000);
});

let task3 = new Promise((resolve, reject) => {
  setTimeout(function(){
    resolve('task3 completed');
  }, 1000);
});

// 鏈接方法
task1.then((data1) => {
  console.log(data1);
  return `${data1} hello`;

}).then((data2) => {
  console.log(data2);
  
});

