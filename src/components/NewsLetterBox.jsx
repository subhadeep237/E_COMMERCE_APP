import React, { useState } from 'react'

const NewsLetterBox = () => {

  const [email,setEmail] = useState('')

  const onSubmitHandler = (event) => {
    event.preventDefault()

    if(email === ''){
      alert('Fill out this email')
      return
    }

    alert('Subscribed Successfully')
  }

  return (
    <div style={{
      textAlign:'center',
      marginTop:'100px',
      marginBottom:'100px'
    }}>

      <p style={{
        fontSize:'32px',
        fontWeight:'600',
        color:'#333'
      }}>
        Subscribe now & get 20% off
      </p>

      <p style={{
        color:'#777',
        marginTop:'15px'
      }}>
        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
      </p>

      <form
        onSubmit={onSubmitHandler}
        style={{
          display:'flex',
          justifyContent:'center',
          marginTop:'30px'
        }}
      >

        <input
          type='email'
          placeholder='Enter your email'
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          style={{
            width:'400px',
            padding:'15px',
            border:'1px solid #ccc',
            outline:'none'
          }}
        />

        <button
          type='submit'
          style={{
            background:'black',
            color:'white',
            padding:'15px 40px',
            border:'none',
            cursor:'pointer'
          }}
        >
          SUBSCRIBE
        </button>

      </form>

    </div>
  )
}

export default NewsLetterBox