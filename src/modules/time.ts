/* ========================================================================== */
/*                                                                            */
/*    brief:                                                :::   ::::::::    */
/*                                                       :+:+:  :+:    :+:    */
/*    start:  01/04/2020                                  +:+         +:+     */
/*                                                       +#+      +#++:       */
/*    update: 01/04/2020                                +#+         +#+       */
/*                                                     #+#  #+#    #+#        */
/*    by: tmartin <tmartin@telecomdesign.fr>        ####### ########          */
/*                                                                            */
/* ========================================================================== */

/* ========================================================================== */
/*                                  IMPORTS                                   */
/* ========================================================================== */
import Dayjs from 'dayjs'
import MinMax from 'dayjs/plugin/minMax'

Dayjs.extend(MinMax)

/* ========================================================================== */
/*                              EXPORT FUNCTIONS                              */
/* ========================================================================== */

export default class Time {
  static getTimeStampHexa(): string {
    const add = parseInt(Dayjs().format().split('+')[1].split(':')[0]) * 3600
    const line = (Dayjs().unix() + add).toString(16)
    return (
      line.substring(6, 2) +
      line.substring(4, 2) +
      line.substring(2, 2) +
      line.substring(0, 2)
    )
  }

  static getTimestamp(): string {
    const add = parseInt(Dayjs().format().split('+')[1].split(':')[0]) * 3600
    const line = (Dayjs().unix() + add).toString()
    return line
  }

  static getTime(): string {
    return Dayjs().format().split('T')[1].split('+')[0]
  }

  static getToday(): string {
    const tYear = Dayjs().year()
    const tMonth = (Dayjs().month() + 1).toLocaleString('en-US', {
      minimumIntegerDigits: 2,
    })
    const tDay = (Dayjs().date() + 0).toLocaleString('en-US', {
      minimumIntegerDigits: 2,
    })
    const temp = `${tYear}-${tMonth}-${tDay}`
    console.log(temp)
    return temp
  }

  static getTomorrow(): string {
    const tYear = Dayjs().year()
    const tMonth = (Dayjs().month() + 1).toLocaleString('en-US', {
      minimumIntegerDigits: 2,
    })
    const tDay = (Dayjs().date() + 1).toLocaleString('en-US', {
      minimumIntegerDigits: 2,
    })
    const temp = `${tYear}-${tMonth}-${tDay}`
    console.log(temp)
    return temp
  }

  static getFrom(date1: string, date2: string): string {
    const tempDay = Dayjs.min(Dayjs(date1), Dayjs(date2))
    const tYear = tempDay.year()
    const tMonth = (tempDay.month() + 1).toLocaleString('en-US', {
      minimumIntegerDigits: 2,
    })
    const tDay = (tempDay.date() + 0).toLocaleString('en-US', {
      minimumIntegerDigits: 2,
    })
    const temp = `${tYear}-${tMonth}-${tDay}`
    console.log(temp)
    return temp
  }

  static getTo(date1: string, date2: string): string {
    const tempDay = Dayjs.max(Dayjs(date1), Dayjs(date2))
    const tYear = tempDay.year()
    const tMonth = (tempDay.month() + 1).toLocaleString('en-US', {
      minimumIntegerDigits: 2,
    })
    const tDay = (tempDay.date() + 0).toLocaleString('en-US', {
      minimumIntegerDigits: 2,
    })
    const temp = `${tYear}-${tMonth}-${tDay}`
    console.log(temp)
    return temp
  }

  static getInstant(): string {
    return Dayjs().format('HH:mm:ss:SSS')
  }
}
