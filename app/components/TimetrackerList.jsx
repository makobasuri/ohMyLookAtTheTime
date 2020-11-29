import React from 'react'
import { Button } from './Button'
import { TimetrackerInput } from './TimetrackerInput'

export const TimetrackerList = ({timeItems, onChangeTimeItem, onContinueTimeToday}) => {

  const timeParts = [...new Set([...timeItems.map(timeItem => `${timeItem.date} ${timeItem.day}`)])]
  const filledTimeParts = timeParts.map(part => ({[part]: timeItems.filter(timeItem => `${timeItem.date} ${timeItem.day}` === part)}))

  return (
    <ul>
      {filledTimeParts.length > 0 ? filledTimeParts.map((part, index) => {
        const partName = Object.keys(part)[0]
        return (
        <li className="omlatt-block block" key={index}>
          <h4 className="m-0 text-xs font-normal text-right">{partName}</h4>
          <ul>
            {part[partName].map(item => (
              <li className="grid gap-3 grid-cols-timetrackerList items-center" key={item.id}>
                <div>
                  <TimetrackerInput name={item.name} id={item.id} onChange={onChangeTimeItem} />
                  <p className="m-0 text-sm text-left">{item.project}</p>
                </div>
                <div className="flex flex-col justify-center">
                  <Button classes="outline-none border-0 rounded-full w-7 h-7 p-0 bg-transparent leading-none cursor-pointer" type="button" handleClick={() => onContinueTimeToday(item.name)}>
                    <span className="inline-block clip-path-play ml-2 mt-1">
                      <span className="block w-3 h-3 bg-white"></span>
                    </span>
                  </Button>
                </div>
                <p className="text-right text-sm font-mono">{item.hours}:{item.minutes}:{item.seconds}</p>
              </li>
            ))}
          </ul>
        </li>
      )}) : ''}
    </ul>
  )
}
