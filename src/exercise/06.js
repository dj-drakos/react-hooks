// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {ErrorBoundary} from 'react-error-boundary'
import { 
  fetchPokemon,
  PokemonInfoFallback, 
  PokemonDataView, 
  PokemonForm 
} from '../pokemon'

function PokemonInfo({pokemonName}) {
  const [ state, setState ] = React.useState({
    pokemon: pokemonName? 'pending' : null,
    error: null,
    status: 'idle'
  })

  const { pokemon, error, status } = state

    React.useEffect(() => {
      if(!pokemonName) return
      setState({ status: 'pending' })
      fetchPokemon(pokemonName)
        .then(pokemon => {
          setState({
            status: 'resolved',
            pokemon
          })
        })
        .catch(error => {
          setState({ 
            error, 
            status: 'rejected',
            })
        })
    }, [pokemonName])

    if(status === 'rejected') throw error
    if(status === 'idle') return 'Submit a pokemon'
    if (status === 'pending') return <PokemonInfoFallback name={pokemonName} />
    else return <PokemonDataView pokemon={pokemon} />
}

function ErrorFallback({error, resetErrorBoundary}) {
  return ( 
    <div role="alert">
    There was an error: 
    <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
  </div>
  )
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary resetKeys={[pokemonName]} onReset={() => setPokemonName('')} FallbackComponent={ErrorFallback}>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
