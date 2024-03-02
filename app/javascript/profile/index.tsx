import React, { useState } from 'react'
import { setCsrfToken } from '../utils'
import Loader, { LoaderColors } from '../components/shared/loader'

const Profile = ({ id, initialUsername }: { id: number, initialUsername: string }) => {
  const [username, setUsername] = useState(initialUsername)
  const [formState, setFormState] = useState({
    username: {
      toggle: false,
      value: username
    }
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const token = setCsrfToken();
    
    try {
      setIsLoading(true)

      const response = await fetch(`/internal_api/accounts/${id}`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": token,
        },
        body: JSON.stringify({ username: formState.username.value })
      })

      const data = await response.json()

      setUsername(data.username)
      setFormState((prevState) => ({...prevState, username: {...prevState.username, toggle: false}}))
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col w-full h-full p-8 md:p-16">
      <div className="flex flex-col border border-gray-300 rounded h-fit p-6 space-y-8">
        <h1 className="text-2xl md:text-3xl">Profile</h1>
          <div className='flex flex-col space-y-8 md:space-y-0 md:flex-row md:justify-between w-full max-w-md'>
          {formState.username.toggle ?
            <form id="username-form" onSubmit={handleSubmit} className="flex flex-col space-y-8 w-full max-w-xs">
              <div className='flex flex-col space-y-2'>
                <label className='font-bold text-lg md:text-xl' htmlFor='username'>Username</label>
                <input
                  id="username"
                  name="username"
                  className='border-2 rounded h-10 w-full px-2'
                  defaultValue={username}
                  onChange={(e) => setFormState((prevState) => ({...prevState, username: {...prevState.username, value: e.target.value}}))}
                />
              </div>
              <button
                className={`flex justify-center px-5 py-2 h-fit bg-gray-500 hover:bg-gray-400 text-white text-center rounded
                            ${(formState.username.value === username || formState.username.value === '') ? 'bg-gray-200 hover:bg-gray-200' : ''}`}
                type='submit'
                disabled={formState.username.value === username || formState.username.value === ''}
              >
                {isLoading ? <Loader color={LoaderColors.white}/> : "Save"}
              </button>
            </form>
          :
            <div className="flex flex-col space-y-2">
              <p className="font-bold text-lg md:text-xl">Username</p>
              <p className="text-gray-500">{username}</p>
            </div>
          }
            <button 
              onClick={() => setFormState((prevState) => ({...prevState, username: {...prevState.username, toggle: !prevState.username.toggle}}))}
              className='px-5 py-2 h-fit w-fit bg-purple-500 hover:bg-purple-400 text-white rounded'
            >
              {formState.username.toggle ? "Cancel" : "Edit"}
            </button>
          </div>
      </div>
    </div>
  )
}

export default Profile