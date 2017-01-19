import translit from '../../utils/translit.js'
import brClean from '../../utils/brclean.js'

class Statistic {
  constructor(curSlide, sessionStorageItem, statisticName) {
    this._currSlide = curSlide;
    this._currSession = sessionStorageItem || '' + Date.now();
    this._statisticName = translit(statisticName);
    this._presentationName = statisticName;
    window.sessionStorage.setItem('sessionNow', this._currSession)
    this._statisticObj = JSON.parse(window.localStorage.getItem(this._statisticName)) || {}

    if (!this._statisticObj[this._currSession]) {
      this._statisticObj[this._currSession] = {}
      // this.sendData()
    }

    this.setItem( 'presentation Name' , statisticName)  
  }
  setItem(statisticId, value) { 
    let newValue = brClean(value)
    this._statisticObj[this._currSession][translit(statisticId)] = newValue;
    console.log(translit(statisticId) +': '+ newValue)  
    this.modifyLocalStorege()
  }

  pushItem(statisticId , value) {
    let oldValue = this._statisticObj[this._currSession][translit(statisticId)]
    if(oldValue === undefined){
      oldValue = [value]
    } else {
      oldValue.push(value)
    }
    console.log(value, 'pushed to', oldValue)
    this._statisticObj[this._currSession][translit(statisticId)] = oldValue
  }

  getItem(statisticId) {
    if(statisticId)
      return this._statisticObj[this._currSession][statisticId];
    else 
      return this._statisticObj[this._currSession]
  }
  set currSlide(path){
    return this._currSlide = path;
  }
  get currSlide() {
    return this._currSlide;
  }
  modifyLocalStorege() { 
    window.localStorage.setItem(this._statisticName, JSON.stringify(this._statisticObj))
  }
  sendData(callbackOk , callbackEr) {
    console.log('sendInit');
    if (localStorage.length) { 
      let xhr = new XMLHttpRequest()
      xhr.open('GET', 'http://localhost:3000/statistic/?id_task=2356_' + localStorage.getItem(this._statisticName), true);
      xhr.setRequestHeader('Access-Control-Allow-Origin', '*'); 
      xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
      xhr.send();
      xhr.onreadystatechange = () => { 
        console.log('next send init')
        if (xhr.readyState == 4 && xhr.status == 200) {
          if(xhr.status == 200) {
            callbackOk();
            localStorage.removeItem(this._statisticName)
            sessionStorage.removeItem('sessionNow')
            document.location = localStorage.referralLink
          }
          else {
            callbackEr(); 
          }

        }
      }
      xhr.onerror = callbackEr(); 
    }
  }
}

export default Statistic
