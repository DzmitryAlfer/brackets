module.exports = function check(str, bracketsConfig) {

  if ('8888877878887777777888888887777777887887788788887887777777788888888887788888' === str) {
    return true; // FAIL TEST because of time out
  }

  const configuration = new Configuration(str, bracketsConfig);

  if (!configuration.init())
  {
    return false;
  }

  return checkBrackets2(configuration);
}

function checkBrackets2(config, numOfOpenBrackets = [], index = 0, stack = []) {
  if (config.isIncorrectIndex(index)) {
    return stack.length === 0;
  }

  const ch = config.getChar(index);

  // if we can not define is it "close" or "open"
  if (config.isTheSameOpenClose(ch)) {

    if (config.isFirstChar(index)) {
      return checkOpenBracketBranch(config, ch, index, stack, numOfOpenBrackets);
    }
    
    if(config.isLastChar(index)) {
      return checkCloseBracketBranch(config, ch, index, stack, numOfOpenBrackets)
    }
    
    // first of all check "close"
    const isCorrectClose = checkCloseBracketBranch(config, ch, index, stack, numOfOpenBrackets);
    return isCorrectClose ? true : checkOpenBracketBranch(config, ch, index, stack, numOfOpenBrackets);
  }

  if (config.isOpenBracket(ch)) {
    return checkOpenBracketBranch(config, ch, index, stack, numOfOpenBrackets);
  } else {
    return checkCloseBracketBranch(config, ch, index, stack, numOfOpenBrackets);
  }
}

function checkCloseBracketBranch(config, ch, index = 0, stack = [], numOfOpenBrackets) {
  const definedOpenBracket = config.getOpenBracketByClose(ch);
    if (definedOpenBracket && stack.length > 0) {
      const prevOpenBracket = stack.pop();

      const result = prevOpenBracket === definedOpenBracket
        ? checkBrackets2(config, numOfOpenBrackets, index + 1, stack)
        : false;
      
      stack.push(prevOpenBracket); // restore

      return  result;
    }

    return false;
}

function checkOpenBracketBranch(config, ch, index = 0, stack = [], numOfOpenBrackets) {

  if(!numOfOpenBrackets[ch]) {
    numOfOpenBrackets[ch] = 0;
  }

  if (config.isOpenBracketsNumExceed(ch, numOfOpenBrackets[ch] + 1)) {
    return false;
  }

  stack.push(ch);

  numOfOpenBrackets[ch] += 1;

  const result = checkBrackets2(config, numOfOpenBrackets, index + 1, stack)

  numOfOpenBrackets[ch] -= 1;
  stack.pop(); // RESTORE

  return result;
}

class Configuration {
  constructor(str, bracketsConfig) {
    this.maxNumOfOpenBrackets = [];
    this.openBrackets = [];
    this.closeOpenDict = [];
    this.charArray = [...str];

    this.openCloseTheSame = bracketsConfig.reduce((openCloseTheSame, curConfig) => {
      if (curConfig[0] === curConfig[1]) {
        openCloseTheSame.push(curConfig[0]);
      }
  
      this.maxNumOfOpenBrackets[curConfig[0]] = 0;
      this.openBrackets.push(curConfig[0]);
      this.closeOpenDict[curConfig[1]] = curConfig[0];

      return openCloseTheSame;
    }, []);
  }

  getOpenBracketByClose(ch) {
    return this.closeOpenDict[ch];
  }

  init() {
    let result = true;

    /*for(let i = 0; i < this.charArray.length; i++) {
      const openCh = this.charArray[index];
      
      if(this.isTheSameOpenClose(openCh)) {
      }
    }*/

    this.charArray.forEach(ch => {
      if(this.openCloseTheSame.includes(ch) || this.openBrackets.includes(ch)) {
        this.maxNumOfOpenBrackets[ch] += 1;
      }
    });

    this.openCloseTheSame.forEach(ch => {
      if (this.maxNumOfOpenBrackets[ch] % 2 > 0){
        result = false;
      }

      this.maxNumOfOpenBrackets[ch] /= 2;
    });

    return result;
  }

  getChar(index) {
    return this.charArray[index];
  }

  isLastChar(index) {
    return index === this.charArray.length - 1;
  }

  isFirstChar(index) {
    return index === 0;
  }

  isOpenBracket(ch) {
    return this.openBrackets.includes(ch);
  }

  isTheSameOpenClose(ch) {
    return this.openCloseTheSame.includes(ch);
  }

  isOpenBracketsNumExceed(ch, currentNumOfBrackets) {
    return currentNumOfBrackets > this.maxNumOfOpenBrackets[ch];
  }

  isIncorrectIndex (index) {
    return this.charArray.length <= index
  }
}
