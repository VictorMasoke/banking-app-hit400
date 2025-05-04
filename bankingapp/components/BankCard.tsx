'use client';

import { formatAmount } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface Account {
  account_id: string;
  account_number: string;
  balance: number;
  account_type: string;
  interest_rate: number;
  status: string;
  opened_date: string;
}

interface CreditCardProps {
  account: Account;
  userName: string;
  showBalance?: boolean;
}

const BankCard = ({ account, userName, showBalance = true }: CreditCardProps) => {
  const [isHovered, setIsHovered] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Format the account number for display (last 4 digits)
  const formattedAccountNumber = `•••• •••• •••• ${account.account_number.slice(-4)}`;

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  // Get card type based on account type
  const getCardType = () => {
    switch(account.account_type.toLowerCase()) {
      case 'savings':
        return '/icons/visa.svg';
      case 'checking':
        return '/icons/mastercard.svg';
      case 'business':
        return '/icons/amex.svg';
      default:
        return '/icons/mastercard.svg';
    }
  };

  // Get gradient based on account type
  const getCardGradient = () => {
    switch(account.account_type.toLowerCase()) {
      case 'savings':
        return 'bg-gradient-to-br from-teal-500 to-emerald-700';
      case 'checking':
        return 'bg-gradient-to-br from-blue-600 to-indigo-800';
      case 'business':
        return 'bg-gradient-to-br from-purple-600 to-fuchsia-800';
      default:
        return 'bg-gradient-to-br from-gray-600 to-gray-900';
    }
  };

  // Animation variants
  const cardVariants = {
    initial: { rotateY: 0, scale: 1 },
    hover: { rotateY: 5, scale: 1.02 },
    tap: { scale: 0.98 }
  }

  const shineVariants = {
    initial: { x: -100, opacity: 0 },
    hover: {
      x: 400,
      opacity: 0.4,
      transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
    }
  }

  return (
    <div className="flex flex-col">
      <Link
        href={`/transaction-history/`}
        className="relative flex h-[220px] w-full max-w-[380px] rounded-2xl shadow-xl overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.div
          className={`relative w-full h-full ${getCardGradient()} p-6`}
          variants={cardVariants}
          initial="initial"
          animate={isHovered ? "hover" : "initial"}
          whileTap="tap"
        >
          {/* Shine effect */}
          <motion.div
            className="absolute top-0 left-0 w-20 h-full bg-white/30 transform skew-x-12"
            variants={shineVariants}
          />

          {/* Holographic stripe */}
          <div className="absolute top-6 right-6 w-16 h-8 rounded-md bg-gradient-to-r from-purple-400 via-pink-300 to-blue-400 opacity-80" />

          {/* Card content */}
          <div className="flex flex-col justify-between h-full w-full z-10 relative">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-lg font-bold text-white/90">
                  {account.account_type} Account
                </h1>
                {showBalance && (
                  <p className="font-ibm-plex-serif font-black text-white text-2xl mt-3">
                    {formatAmount(account.balance)}
                  </p>
                )}
              </div>

              {/* Card status indicator */}
              <div className={`w-3 h-3 rounded-full ${account.status === 'active' ? 'bg-green-400 shadow-green-glow' : 'bg-red-400'}`} />
            </div>

            <div className="flex flex-col gap-3">
              {/* Time display */}
              <div className="text-xs font-mono text-white/80">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>

              {/* Card number with animation */}
              <motion.p
                className="text-sm font-semibold tracking-widest text-white"
                initial={{ y: 0 }}
                animate={{ y: isHovered ? -2 : 0 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {formattedAccountNumber}
              </motion.p>

              <div className="flex justify-between items-end">
                <h1 className="text-sm font-bold text-white/90">
                  {userName.toUpperCase()} {" ● ● ● ● ●"}
                </h1>

                {/* Card provider logos */}
                <div className="flex items-center space-x-2">
                  <div className='ml-6'>

                  </div>
                  <Image
                    src={getCardType()}
                    width={50}
                    height={30}
                    alt="card-type"
                    className="opacity-90"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute bottom-0 left-0 w-full h-8 bg-black/10 backdrop-blur-sm" />
          <div className="absolute top-0 left-0 w-full h-2 bg-white/10" />
        </motion.div>
      </Link>

      {/* Account details footer with animation */}
      <motion.div
        className="mt-3 pl-3"
        initial={{ opacity: 0.8 }}
        animate={{ opacity: isHovered ? 1 : 0.8 }}
      >
        <p className="text-xs font-semibold text-gray-600">
          {account.account_number} • {account.interest_rate}% APR
        </p>
        <p className="text-xs font-semibold text-gray-600">
          Opened: {new Date(account.opened_date).toLocaleDateString()}
        </p>
      </motion.div>
    </div>
  )
}

export default BankCard
