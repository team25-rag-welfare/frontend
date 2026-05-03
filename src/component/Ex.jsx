import { useState } from 'react'
import useStore from '../store/useStore';

function Ex() {
  const [] = useState(0)
  const { count, increase, decrease } = useStore();
  
  return (
    <div>
      <h1>{count}</h1>
      <button onClick={increase}>+</button>
      <button onClick={decrease}>-</button>
      </div>
  )
}

export default Ex;
