import React from 'react';

const Button = ({onClick,onSubmit,className,children}) => 

<button
  type="button"
  onClick={onClick}
  onSubmit={onSubmit}
  className={className}>
  {children}
</button>

export default Button;