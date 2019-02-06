import React, { useRef, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

const HumanSize = ({ size }) => {
  const byteUnits = ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  let i = -1
  do {
    size = size / 1024
    i++
  } while (size > 1024)

  return size.toFixed(1) + ' ' + byteUnits[i]
}
HumanSize.propTypes = {
  size: PropTypes.number.isRequired
}

const usePreview = (value) => {
  const [url, setUrl] = useState(false)
  useEffect(() => {
    if (!value || !value.type.startsWith('image/')) return
    setUrl(value instanceof File ? URL.createObjectURL(value) : value.url)
    return () => {
      URL.revokeObjectURL(url)
    }
  }, [value])
  return url
}

const FileEntry = ({ value, onRemove, onReplace }) => {
  const url = usePreview(value)
  let preview
  let thumbClass = 'thumb '
  if (url) {
    preview = <img src={url} alt={value.name} />
    thumbClass += 'image'
  } else {
    const lastDot = value.name.lastIndexOf('.')
    let ext = lastDot > -1 ? value.name.substr(lastDot) : '.*'
    if (ext.length > 5) ext = '.*'
    preview = ext
    thumbClass += 'ext'
  }
  return (
    <div className="file-entry">
      <div className={thumbClass} onClick={onReplace}>
        {preview}
      </div>
      <div className="info">
        <div className="filename">{value.name}</div>
        <div className="size"><HumanSize size={value.size} /></div>
      </div>
      <div className="remove-file" onClick={onRemove} />
    </div>
  )
}
FileEntry.propTypes = {
  value: PropTypes.object,
  onRemove: PropTypes.func,
  onReplace: PropTypes.func
}

const FileTypeEditor = ({ field, value, onChange }) => {
  const inputRef = useRef()
  const replacePos = useRef(-1)

  const entries = field.multiple ? (value || []) : (value ? [value] : [])
  const showAddPlaceholder = field.multiple || !value

  // Event handlers
  const handleReplace = (i) => () => {
    replacePos.current = i
    inputRef.current.click()
  }
  const handleChange = (e) => {
    const files = e.target.files
    if (files.length) {
      if (field.multiple) {
        let newList = entries.slice()
        const newEntries = Array.from(files)
        if (replacePos.current > -1) {
          newList.splice.apply(newList, [replacePos.current, 1].concat(newEntries))
        } else {
          newList = newList.concat(newEntries)
        }
        onChange(newList)
      } else {
        onChange(files[0])
      }
    }
  }
  const handleRemove = (i) => () => {
    if (field.multiple) {
      const newList = value.slice()
      newList.splice(i, 1)
      onChange(newList)
    } else {
      onChange(false)
    }
  }

  // Wrap it all
  return (
    <div className="file-picker">
      <input ref={inputRef} type="file" onChange={handleChange}
        multiple={field.multiple} />
      {entries.map((entry, i) =>
        <FileEntry key={i} value={entry}
          onReplace={handleReplace(i)} onRemove={handleRemove(i)} />
      )}
      {showAddPlaceholder && (
        <div className="file-entry add">
          <div className="thumb" onClick={handleReplace(-1)}>+</div>
          <div className="info">
            <FormattedMessage id={entries.length ? 'files.add' : 'files.none'} />
          </div>
        </div>
      )}
    </div>
  )
}

FileTypeEditor.propTypes = {
  field: PropTypes.object.isRequired,
  value: PropTypes.oneOfType([PropTypes.object, PropTypes.bool, PropTypes.array]),
  onChange: PropTypes.func.isRequired
}

const FileTypeViewer = (props) => (
  <span>{props.value}</span>
)

FileTypeViewer.propTypes = {
  value: PropTypes.any
}

const preSave = ({ field, value, entity, attachments }) => {
  const entries = field.multiple ? (value || []) : (value ? [value] : [])
  entries.forEach((entry) => entry instanceof File && attachments.push({
    type: 'file',
    field: field.name,
    path: field.path,
    file: value
  }))

  const values = entries.map((value) => {
    if (!(value instanceof File)) return value
    const { name, size, type, lastModified } = value
    return { name, size, type, lastModified }
  })

  entity[field.name] = field.multiple ? values : values[0]
}

export default {
  name: 'file',
  view: FileTypeViewer,
  edit: FileTypeEditor,
  preSave
}
