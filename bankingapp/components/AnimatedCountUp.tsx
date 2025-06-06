import React from 'react'
import CountUp from 'react-countup'
import { formatAmount } from '@/lib/utils'

const AnimatedCountUp = ({ amount }: { amount: number}) => {
  return (
    <div className='w-full'>
      <CountUp
        decimal=','
        prefix='$'
        decimals={2}
        end={amount} 
      />
    </div>
  )
}

export default AnimatedCountUp
