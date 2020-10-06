import React, { useState } from 'react'
import { connect } from 'react-redux'
import Button from '../../../UI/Button/Button'

function SmartButton ({
  loadingActions,
  name,
  handleClick,
  url,
  payload,
  method,
  index,
  label,
  successMessageHeader
}) {
  const [success, setSuccess] = useState(false)

  return (
    <>
      <Button
        loading={loadingActions[name]}
        disabled={loadingActions[name]}
        onClick={handleClick(
          {
            method,
            payload,
            url,
            successMessageHeader
          },
          name,
          index
        )}
      >
        {label}
      </Button>
    </>
  )
}

const mapStateToProps = (state) => {
  return {
    loadingActions: state.option.loadingActions
  }
}

export default connect(mapStateToProps)(SmartButton)
