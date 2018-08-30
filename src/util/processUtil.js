export class ProcessUtil{
  static wait(waitMs =1000){
    retun new Promise(
      (resolve,reject)=>{
        setTimeout(()=>{resolve()},waitMs);
      }
    );
  }
}
