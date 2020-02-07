import React from 'react'

export const Button = ({classes, handleClick, children}) => {
  return (
    <button className={classes} type="button" onClick={handleClick}>{children}</button>
  )
}
