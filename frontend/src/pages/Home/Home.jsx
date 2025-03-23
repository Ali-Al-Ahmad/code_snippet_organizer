import { useEffect, useState } from 'react'
import axiosInstance from '../../utils/AxiosInstance'
import './Home.css'
import EditIcon from '../../assets/edit.svg'
import DeleteIcon from '../../assets/trash-solid.svg'
import IsFavorite from '../../assets/star-gold.svg'
import NotFavorite from '../../assets/star-grey.svg'

import { useNavigate } from 'react-router-dom'

const TagDropdown = ({ allTags, selectedTags, handleTagChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className='tag-dropdown'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='dropdown-button'
      >
        Select Tags {!isOpen && <span>&#9660;</span>}
        {isOpen && <span> &#9650;</span>}
      </button>

      {isOpen && (
        <div className='dropdown-menu'>
          {allTags.length > 0 ? (
            allTags.map((tag, index) => (
              <label
                key={index}
                className='dropdown-item'
              >
                <input
                  type='checkbox'
                  checked={selectedTags.includes(tag)}
                  onChange={() => handleTagChange(tag)}
                />
                {tag}
              </label>
            ))
          ) : (
            <p className='dropdown-item'>No tags available</p>
          )}
        </div>
      )}
    </div>
  )
}

const SnippetCard = ({
  snippet,
  handleDeleteSnippet,
  handleEditSnippet,
  handleFavorite,
}) => (
  <div className='snippet-card'>
    <pre className='code-block'>
      <code>{snippet.content}</code>
    </pre>
    <p className='snippet-keywords'>Language: {snippet.language}</p>
    <p className='snippet-keywords'>Keywords: {snippet.keywords}</p>
    <div className='snippet-tags'>
      <div className='card-tags'>
        {snippet.tags?.map((tag, index) => (
          <span
            key={index}
            className='tag'
          >
            {tag.name}
          </span>
        ))}
      </div>
      <div className='action-buttons'>
        <img
          className='favorite-icon'
          src={snippet.isFavorite ? IsFavorite : NotFavorite}
          onClick={() => handleFavorite(snippet)}
          alt=''
        />
        <img
          className='edit-icon'
          src={EditIcon}
          onClick={() => handleEditSnippet(snippet)}
          alt=''
        />

        <img
          className='delete-icon'
          src={DeleteIcon}
          onClick={() => handleDeleteSnippet(snippet?.id)}
          alt=''
        />
      </div>
    </div>
  </div>
)

const Home = ({ search }) => {
  const [snippets, setSnippets] = useState([])
  const [filteredSnippets, setFilteredSnippets] = useState([])
  const [allTags, setAllTags] = useState([])
  const [selectedTags, setSelectedTags] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    fetchSnippets()
    fetchTags()
  }, [])

  const fetchSnippets = async () => {
    try {
      const response = await axiosInstance.get('/auth/userSnippets')
      setSnippets(response.data.data)
    } catch (error) {
      console.error('Error fetching snippets:', error)
    }
  }

  const fetchTags = async () => {
    try {
      const response = await axiosInstance.get('/auth/userTags')
      setAllTags(response.data.data)
    } catch (error) {
      console.error('Error fetching tags:', error)
    }
  }

  const handleTagChange = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  useEffect(() => {
    setFilteredSnippets(
      snippets.filter(
        (snippet) =>
          (search === '' ||
            snippet.content.toLowerCase().includes(search.toLowerCase())) &&
          (selectedTags.length === 0 ||
            snippet.tags.some((t) => selectedTags.includes(t.name)))
      )
    )
  }, [search, selectedTags, snippets])

  const handleDeleteSnippet = async (id) => {
    try {
      const confirmed = confirm('Are you sure you want to delete?')
      if (confirmed) {
        const response = await axiosInstance.delete(
          `/snippets/deletesnippet/${id}`
        )

        if (response.data.success) {
          setSnippets((prev) => prev.filter((snippet) => snippet.id != id))
        }
        console.log(response)
      }
    } catch (error) {
      console.error('Error fetching tags:', error)
    }
  }

  const handleEditSnippet = async (snippet) => {
    try {
      const confirmed = confirm('Are you sure you want to Edit?')
      if (confirmed) {
        navigate('/upload', { state: { snippet } })
      }
    } catch (error) {
      console.error(error)
    }
  }
  const handleFavorite = async (snippet) => {
    try {
      setSnippets((prevSnippets) =>
        prevSnippets.map((s) =>
          s.id === snippet.id ? { ...s, isFavorite: !s.isFavorite } : s
        )
      )
      const response = await axiosInstance.post(`/snippets/editsnippet/`, {
        id: snippet.id,
        isFavorite: !snippet.isFavorite,
      })
      console.log(response)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className='container'>
      <div className='container-head'>
        <h1 className='title'>My Snippets</h1>
        <TagDropdown
          allTags={allTags}
          selectedTags={selectedTags}
          handleTagChange={handleTagChange}
          setSnippets={setSnippets}
        />
      </div>
      <div className='snippets-container'>
        {filteredSnippets.length > 0 ? (
          filteredSnippets.map((snippet) => (
            <SnippetCard
              key={snippet.id}
              snippet={snippet}
              handleDeleteSnippet={handleDeleteSnippet}
              handleEditSnippet={handleEditSnippet}
              handleFavorite={handleFavorite}
            />
          ))
        ) : (
          <p className='no-snippets'>No snippets found.</p>
        )}
      </div>
    </div>
  )
}

export default Home
