import React from 'react'
import './GameOver.css'

const GameOver = ({ retry, score }) => {
  return (
    <div className='start'>
      <h2>GameOver</h2>
      <h1>Fim de Jogo!</h1>
      <h3>Sua Pontuação foi: <spa>{score}</spa></h3>
      <button onClick={retry}>Reiniciar jogo!</button>
    </div>
  )
}

export default GameOver;