import React, { Component } from 'react'
import DynamicContentList from '../../../components/DynamicContentList/DynamicContentList'

class ContentList extends Component {
  render () {
    return (
      <DynamicContentList content={this.props.match.params.content} />
    )
  }
}

export default ContentList
