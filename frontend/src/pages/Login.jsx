import { useState } from 'react'
import { Link } from "react-router-dom";

function Login() {

  return (
    <>
      <h1>
        Login page
      </h1>
      <Link to="/register">
        <button>
          Register
        </button>
      </Link>
    </>
  )
}

export default Login
