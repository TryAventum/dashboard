import React, { } from 'react'
import RenderNormalField from './RenderNormalField/RenderNormalField'

export default function RenderNormalFields({
  fields,
  mainFieldName,
  currentContentValues,
  puuid,
  match,
  location,
  history,
  handleChange,
  handleClick,
  index,
  minusClicked,
  plusClicked,
}) {
  return fields
    ? fields.map((f) => {
        let value = ''

        if (f.value) {
          value = f.value
        } else if (mainFieldName && currentContentValues) {
          value = currentContentValues[f.name]
        }

        // If we have a repeatable custom field then the fields will have the same id in each iteration of the custom field and that cause issues with drag and drop, we do this to avoid this issue.
        const fid = puuid ? puuid + f.id : f.id
        return (
          <RenderNormalField
            key={f.id ? f.id : f.name}
            {...f}
            id={fid}
            match={match}
            location={location}
            history={history}
            handleChange={handleChange}
            handleClick={handleClick}
            index={index}
            value={value}
            minusClicked={minusClicked}
            plusClicked={plusClicked}
          />
        )
      })
    : null
}
