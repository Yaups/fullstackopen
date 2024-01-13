import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAllAnecdotes, updateAnecdote } from './requests'
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'

const App = () => {
  const queryClient = useQueryClient()

  const upvoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: anecdoteToUpdate => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.map(a => a.id === anecdoteToUpdate.id ? anecdoteToUpdate : a))
    }
  })

  const handleVote = anecdote => {
    const upvotedAnecdote = { ...anecdote, votes: anecdote.votes + 1 }
    upvoteMutation.mutate(upvotedAnecdote)
  }

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAllAnecdotes
  })


  if (result.isLoading) {
    return <div>Loading anecdotes data from server... (Will retry 5 times before giving up)</div>
  }

  if (result.isError) {
    return <div>Anecdote service not available due to problems in server</div>
  }


  const anecdotes = result.data

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
