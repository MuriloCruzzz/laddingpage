import React from 'react'

export default function ParallaxBackground({ children }) {
  return (
    <div className="page">
      <div className="bg"></div>
      <main className="content">{children}</main>
    </div>
  )
}