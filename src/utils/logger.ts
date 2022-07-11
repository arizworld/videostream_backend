import chalk from 'chalk'
export enum LogType{
    info = 'info',
    danger = 'danger',
    success = 'success',
    warning = 'warning'
}
export enum chalkColor{
    info = 'blue',
    danger = 'red',
    success = 'green',
    warning = 'yellow'
}
export const logger = function(message:string,logType:LogType){
    for(let key in LogType){
        if(logType === LogType[key as keyof typeof LogType]){
            const color = chalkColor[key as keyof typeof LogType];
            console.log(chalk[color].bold(`${key.toUpperCase()}:: `) + chalk[color](message.toSentanceCase()) + ' At ' + chalk.white(new Date()));
        }
    }
}

String.prototype.toSentanceCase = function(){
    return this.toLowerCase().split(' ').map(word=>word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}