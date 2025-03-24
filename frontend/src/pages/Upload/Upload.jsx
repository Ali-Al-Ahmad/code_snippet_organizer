import { useState } from 'react'
import axiosInstance from '../../utils/AxiosInstance'
import { useNavigate, useLocation } from 'react-router-dom'
import './Upload.css'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Upload = () => {
  const location = useLocation()
  const [content, setContent] = useState(location.state?.snippet?.content || '')
  const [language, setLanguage] = useState(
    location.state?.snippet?.language || ''
  )
  const snippetId = location.state?.snippet?.id
  const [tags, setTags] = useState(
    location.state?.snippet?.tags.map((tag) => tag.name)?.join(', ') || []
  )
  const [keywords, setKeywords] = useState(
    location.state?.snippet?.keywords || ''
  )
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    const newSnippet = {
      content,
      language,
      tags: tags.split(',').map((tag) => tag.trim()),
      keywords: keywords,
    }

    try {
      let response

      if (snippetId) {
        newSnippet.id = snippetId
        response = await axiosInstance.post(
          `/snippets/editsnippet`,
          newSnippet
        )
        console.log("resppedit,",response);
      } else {
        response = await axiosInstance.post('/snippets/addsnippet', newSnippet)
                console.log('respADd,', response)

      }
      if (response?.data?.success) {
        navigate('/home')
        toast.success(response?.data?.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message)
    }
  }

  return (
    <div className='add-snippet-container'>
      <h1 className='title'>{snippetId ? 'Edit' : 'Add'} Snippet</h1>
      <form
        onSubmit={handleSubmit}
        className='snippet-form'
      >
        <div className='form-group'>
          <label>Code:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows='6'
            className='input-field'
            required
          />
        </div>

        <div className='form-group'>
          <label>Language:</label>
          <input
            type='text'
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className='input-field'
            placeholder='programming language'
            required
          />
        </div>

        <div className='form-group'>
          <label>Keywords:</label>
          <input
            type='text'
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className='input-field'
            placeholder='snippet keywords'
          />
        </div>

        <div className='form-group'>
          <label>Tags (comma-separated):</label>
          <input
            type='text'
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className='input-field'
            placeholder='snippet tags'
          />
        </div>

        <button
          type='submit'
          className='submit-btn'
        >
          {snippetId ? 'Edit' : 'Add'} Snippet
        </button>
      </form>
    </div>
  )
}

export default Upload
